#!/usr/bin/env python
"""Refresh open CFPs from the Confs.tech open conference dataset.

Confs.tech (github.com/tech-conferences/conference-data) ships a
machine-readable, topic-sharded JSON catalog of tech conferences with an
optional `cfpUrl`/`cfpEndDate` pair. This script pulls the topic files most
relevant to this tracker's interests (data/AI, cloud, DevOps, .NET, APIs,
security, IoT, product) for the current and next couple of years, keeps only
entries with an open CFP, and writes them out in the same shape as
sessionize-opportunities.js so tracker-core.js can merge both catalogs.

Confs.tech does not expose CFP page text (only name/url/city/country), so
travel-sponsorship is always reported as "Not stated" here rather than
guessed — unlike the Sessionize scraper, which reads the live CFP page.
"""

import argparse
import datetime as dt
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

RAW_BASE = "https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences"
MINIMUM_MATCH_SCORE = 2
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; SpeakerApplicationTracker/1.0; "
        "+https://github.com/FairyFox5700/speaker-application-tracker)"
    )
}

# Confs.tech topic files worth pulling for this tracker, with a base relevance
# weight reflecting how likely that topic bucket is to contain Agentic
# AI/Azure/Copilot/data/cloud talks.
TOPIC_FILES = {
    "data": 3,
    "devops": 3,
    "dotnet": 3,
    "general": 1,
    "api": 1,
    "security": 1,
    "iot": 1,
    "product": 1,
}

KEYWORD_WEIGHTS = {
    "Agentic AI": (r"agentic|ai agents?|multi-agent", 4),
    "Azure": (r"\bazure\b", 4),
    "Copilot": (r"copilot", 4),
    "AI Engineering": (r"\b(ai|artificial intelligence|llm|generative ai|machine learning)\b", 3),
    "RAG / MCP": (r"\brag\b|retrieval.augmented|model context protocol|\bmcp\b", 3),
    "Microsoft Data": (r"microsoft fabric|power bi|data platform|data engineering|databricks|\bsql\b", 2),
    "Cloud / DevOps": (r"cloud|devops|kubernetes|platform engineering|software architecture", 1),
    ".NET": (r"\.net\b|dotnet|c#", 1),
}


def fetch(url, timeout=30):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", "ignore")


def fetch_json(url):
    try:
        return json.loads(fetch(url))
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise
    except urllib.error.URLError:
        return None


def parse_date(value):
    return dt.date.fromisoformat(value)


def topics_for(text):
    found = {}
    for name, (pattern, weight) in KEYWORD_WEIGHTS.items():
        if re.search(pattern, text, re.I):
            found[name] = weight
    return found


def extract(entry, year, topic_file, base_weight, cutoff):
    cfp_url = entry.get("cfpUrl")
    cfp_end = entry.get("cfpEndDate")
    if not cfp_url or not cfp_end:
        return None
    try:
        deadline = parse_date(cfp_end)
    except ValueError:
        return None
    if deadline < cutoff:
        return None

    name = entry.get("name") or cfp_url
    haystack = " ".join(
        str(entry.get(field, "")) for field in ("name", "city", "country")
    )
    topic_weights = topics_for(haystack)
    match_score = base_weight + sum(topic_weights.values())
    if match_score < MINIMUM_MATCH_SCORE:
        return None

    try:
        event_date = parse_date(entry["startDate"]) if entry.get("startDate") else deadline
    except ValueError:
        event_date = deadline

    online = bool(entry.get("online"))
    city = entry.get("city") or ""
    country = entry.get("country") or ""
    if online and not city and not country:
        location = "Online"
        delivery_mode = "Online"
    else:
        location_parts = [part for part in (city, country) if part]
        location = ", ".join(location_parts) if location_parts else "Location not stated"
        delivery_mode = "Hybrid" if online else "In-person"

    travel_support = "Online / no trip" if delivery_mode == "Online" else "Not stated"
    travel_details = (
        "Online conference; no travel is required."
        if delivery_mode == "Online"
        else "Confs.tech does not publish travel-support details; check the CFP page."
    )

    slug = re.sub(r"[^a-z0-9]+", "-", f"{name}-{year}".lower()).strip("-")
    return {
        "id": "confstech-" + slug,
        "name": name,
        "category": "Confs.tech opportunity",
        "eventDate": event_date.isoformat(),
        "deadlineDate": deadline.isoformat(),
        "deadlineTimezone": "UTC",
        "location": location,
        "deliveryMode": delivery_mode,
        "sourceType": "Confs.tech CFP",
        "source": "Confs.tech open conference dataset",
        "sourceUrl": cfp_url,
        "sourceStatus": "CFP open",
        "sourceScore": round(min(match_score / 10, 1), 2),
        "matchScore": match_score,
        "travelSupport": travel_support,
        "travelDetails": travel_details,
        "topics": sorted(topic_weights.keys()) or ["Cloud / DevOps"],
        "audience": ["Developers", "Architects", "Engineering leaders"],
        "status": "Not started",
        "priority": "High" if match_score >= 7 else "Medium",
        "matchedTalkIds": [],
        "nextAction": "Review the CFP and submit the best-matching talk.",
        "notes": "",
        "submittedAt": "",
        "confirmationReference": "",
        "lastUpdated": cutoff.isoformat(),
    }


def render_module(data):
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    return (
        "(function (root, factory) {\n"
        "  const data = factory();\n"
        "  if (typeof module === 'object' && module.exports) module.exports = data;\n"
        "  root.ConfsTechOpportunities = data;\n"
        "})(typeof globalThis !== 'undefined' ? globalThis : this, function () {\n"
        f"  return {payload};\n"
        "});\n"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cutoff", help="YYYY-MM-DD; defaults to UTC today")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).resolve().parents[1] / "confstech-opportunities.js"),
    )
    args = parser.parse_args()
    cutoff = (
        dt.date.fromisoformat(args.cutoff)
        if args.cutoff
        else dt.datetime.now(dt.timezone.utc).date()
    )
    years = [cutoff.year, cutoff.year + 1, cutoff.year + 2]

    retained = []
    checked_files = 0
    missing_files = 0
    for year in years:
        for topic_file, base_weight in TOPIC_FILES.items():
            url = f"{RAW_BASE}/{year}/{topic_file}.json"
            entries = fetch_json(url)
            checked_files += 1
            if entries is None:
                missing_files += 1
                continue
            for entry in entries:
                result = extract(entry, year, topic_file, base_weight, cutoff)
                if result:
                    retained.append(result)

    deduplicated = {
        item["sourceUrl"].rstrip("/").lower(): item for item in retained
    }
    items = sorted(
        deduplicated.values(),
        key=lambda item: (item["deadlineDate"], -item["matchScore"], item["name"]),
    )
    data = {
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "cutoff": cutoff.isoformat(),
        "checkedFiles": checked_files,
        "missingFiles": missing_files,
        "retainedCount": len(items),
        "minimumMatchScore": MINIMUM_MATCH_SCORE,
        "items": items,
    }
    output = Path(args.output)
    output.write_text(render_module(data), encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(output),
                "checkedFiles": checked_files,
                "missingFiles": missing_files,
                "retainedCount": len(items),
            }
        )
    )


if __name__ == "__main__":
    main()
