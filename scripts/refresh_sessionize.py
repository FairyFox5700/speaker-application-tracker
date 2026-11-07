#!/usr/bin/env python
"""Refresh all strongly matched, public, open Sessionize CFPs."""

import argparse
import concurrent.futures
import datetime as dt
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

SITEMAP = "https://sessionize.com/sitemap/events.xml"
MINIMUM_MATCH_SCORE = 11
MONTHS = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec"
DATE_RE = rf"(\d{{1,2}}\s+(?:{MONTHS})\s+\d{{4}})"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; SpeakerApplicationTracker/1.0; "
        "+https://github.com/FairyFox5700/speaker-application-tracker)"
    )
}


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        if data.strip():
            self.parts.append(data.strip())


def fetch(url, timeout=30):
    request = urllib.request.Request(url, headers=HEADERS)
    last_error = None
    for _ in range(2):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read().decode("utf-8", "ignore")
        except Exception as error:
            last_error = error
    if last_error is not None:
        raise last_error
    raise RuntimeError(f"Failed to fetch {url}")


def textify(raw):
    parser = TextParser()
    parser.feed(raw)
    return re.sub(r"\s+", " ", html.unescape(" ".join(parser.parts)))


def parse_date(value):
    return dt.datetime.strptime(value, "%d %b %Y").date()


def evidence_sentence(text, patterns, fallback):
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            return re.sub(r"\s+", " ", match.group(0)).strip()[:500]
    return fallback


def extract(url, cutoff):
    try:
        raw = fetch(url)
        text = textify(raw)
    except Exception as error:
        return {"url": url, "error": str(error)}

    if "Call for Speakers" not in text and "Call for Papers" not in text:
        return None
    if re.search(
        r"Call for (?:Speakers|Papers) is closed|Submissions are no longer possible",
        text,
        re.I,
    ):
        return None

    deadline_match = re.search(r"Call closes at.*?" + DATE_RE, text, re.I)
    if not deadline_match:
        return None
    deadline = parse_date(deadline_match.group(1).title())
    if deadline < cutoff:
        return None

    title_match = re.search(r"<title>(.*?)</title>", raw, re.I | re.S)
    title = html.unescape(title_match.group(1)).strip() if title_match else url
    title = re.sub(
        r"\s*[:|-]\s*Call for (?:Speakers|Papers).*", "", title, flags=re.I
    )
    lowered = text.lower()
    topic_weights = {
        "Agentic AI": 4 if re.search(r"agentic|ai agents?|multi-agent", lowered) else 0,
        "Azure": 4 if "azure" in lowered else 0,
        "Copilot": 4 if "copilot" in lowered else 0,
        "AI Engineering": 3
        if re.search(
            r"\b(ai|artificial intelligence|llm|generative ai|machine learning)\b",
            lowered,
        )
        else 0,
        "RAG / MCP": 3
        if re.search(
            r"\brag\b|retrieval.augmented|model context protocol|\bmcp\b", lowered
        )
        else 0,
        "Microsoft Data": 2
        if re.search(
            r"microsoft fabric|power bi|data platform|data engineering|databricks",
            lowered,
        )
        else 0,
        "Cloud / DevOps": 1
        if re.search(
            r"cloud|devops|platform engineering|software architecture|developer tools?",
            lowered,
        )
        else 0,
    }
    match_score = sum(topic_weights.values())
    if match_score < MINIMUM_MATCH_SCORE:
        return None

    event_match = re.search(r"event (?:date|starts).*?" + DATE_RE, text, re.I)
    event_date = (
        parse_date(event_match.group(1).title()) if event_match else deadline
    )
    location_candidates = re.findall(r"location\s+(.*?)\s+website\s+", text, re.I)
    clean_locations = [
        value.strip()
        for value in location_candidates
        if len(value.strip()) <= 180
        and not re.search(r"null;|services\.visualstudio|function\s*\(|endpointUrl|var\s+", value, re.I)
    ]
    location = min(clean_locations, key=len) if clean_locations else "Location not stated"

    if (
        re.search(r"\bonline\b|\bvirtual\b|100% remote", location, re.I)
        or re.search(r"one-day free online conference|location Online", text, re.I)
    ):
        delivery_mode = "Online"
    elif re.search(
        r"hybrid|online and in-person|in-person and online", text, re.I
    ):
        delivery_mode = "Hybrid"
    else:
        delivery_mode = "In-person"

    if delivery_mode == "Online":
        travel_support = "Online / no trip"
        travel_details = "Online event; no travel is required."
    elif re.search(
        r"travel and accommodation expenses are not covered|"
        r"travel expenses are not covered|"
        r"make their own travel and hotel arrangements|"
        r"will not be providing any reimbursements for travel",
        text,
        re.I,
    ):
        travel_support = "Not covered"
        travel_details = "The public CFP states that speaker travel/accommodation is not covered."
    elif re.search(
        r"travel expenses covered|travel stipend|transportation costs up to|"
        r"refund of up to .*travel|accommodation covered|travel reimbursement",
        text,
        re.I,
    ):
        travel_support = "Travel sponsored"
        travel_details = evidence_sentence(
            text,
            [
                r"[^.]{0,100}(?:travel stipend|transportation costs up to|refund of up to|"
                r"travel reimbursement|accommodation covered|hotel accommodations)[^.]{0,180}\.",
                r"[^.]{0,100}travel expenses covered[^.]{0,150}",
            ],
            "The public CFP states that speaker travel support is available.",
        )
    elif re.search(
        r"hotel coverage.*depends|partial reimbursement|travel support.*case", text, re.I
    ):
        travel_support = "Partial / conditional"
        travel_details = "Some travel support may be available; confirm with the organizer."
    else:
        travel_support = "Not stated"
        travel_details = "Speaker travel support is not stated on the public CFP page."

    slug = re.sub(r"[^a-z0-9]+", "-", url.rstrip("/").split("/")[-1].lower()).strip("-")
    return {
        "id": "sessionize-" + slug,
        "name": title,
        "category": "Sessionize opportunity",
        "eventDate": event_date.isoformat(),
        "deadlineDate": deadline.isoformat(),
        "deadlineTimezone": "UTC",
        "location": location,
        "deliveryMode": delivery_mode,
        "sourceType": "Sessionize public CFP",
        "source": "Sessionize public open CFP",
        "sourceUrl": url,
        "sourceStatus": "CFP open",
        "sourceScore": round(min(match_score / 18, 1), 2),
        "matchScore": match_score,
        "travelSupport": travel_support,
        "travelDetails": travel_details,
        "topics": [name for name, weight in topic_weights.items() if weight],
        "audience": ["Developers", "Architects", "Engineering leaders"],
        "status": "Not started",
        "priority": "High" if match_score >= 15 else "Medium",
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
        "  root.SessionizePublicOpportunities = data;\n"
        "})(typeof globalThis !== 'undefined' ? globalThis : this, function () {\n"
        f"  return {payload};\n"
        "});\n"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cutoff", help="YYYY-MM-DD; defaults to UTC today")
    parser.add_argument(
        "--output",
        default=str(Path(__file__).resolve().parents[1] / "sessionize-opportunities.js"),
    )
    args = parser.parse_args()
    cutoff = (
        dt.date.fromisoformat(args.cutoff)
        if args.cutoff
        else dt.datetime.now(dt.timezone.utc).date()
    )

    sitemap = ET.fromstring(fetch(SITEMAP, 60))
    urls = []
    for entry in sitemap:
        location = next((node.text for node in entry if node.tag.endswith("loc")), None)
        priority = next(
            (node.text for node in entry if node.tag.endswith("priority")), None
        )
        if location and priority in {"0.8", "0.5"}:
            urls.append(location)

    retained = []
    errors = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        for result in executor.map(lambda url: extract(url, cutoff), urls):
            if result and result.get("error"):
                errors.append(result)
            elif result:
                retained.append(result)

    deduplicated = {
        item["sourceUrl"].rstrip("/").lower(): item for item in retained
    }
    items = sorted(
        deduplicated.values(),
        key=lambda item: (
            item["deadlineDate"],
            -item["matchScore"],
            item["name"],
        ),
    )
    data = {
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "cutoff": cutoff.isoformat(),
        "candidatePages": len(urls),
        "retainedCount": len(items),
        "minimumMatchScore": MINIMUM_MATCH_SCORE,
        "errorCount": len(errors),
        "errors": errors,
        "items": items,
    }
    output = Path(args.output)
    output.write_text(render_module(data), encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(output),
                "candidatePages": len(urls),
                "retainedCount": len(items),
                "errorCount": len(errors),
            }
        )
    )


if __name__ == "__main__":
    main()
