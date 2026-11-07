# Speaker Application Tracker

A local-first CFP and speaker-application pipeline focused on agentic systems, Azure, AI engineering, cloud/data, and developer audiences.

## Features

- Complete public Sessionize scan across all current high-priority sitemap entries
- 124 strongly matched, open Sessionize CFPs in the initial generated catalog
- Daily refresh at 05:45 UTC removes expired CFPs and deploys newly discovered matches
- Three LinkedIn speaker leads with explicit future deadlines and direct source links
- One signed-in Sessionize Discover recommendation
- Verified travel-support labels, including two trip-sponsored conferences
- Source filter for official CFPs, LinkedIn leads, and Sessionize recommendations
- Passed deadlines are excluded automatically
- Computed deadline urgency (never stored as a stale status)
- Application pipeline statuses and inline status updates
- Deterministic talk-to-CFP matching with visible reasons
- Search and combined status/deadline/priority filters
- Add, edit, and delete opportunities
- Browser persistence under `speakerTracker:v5`, including refresh-safe statuses and dismissals
- JSON backup/import and RFC 4180-compatible CSV export
- Responsive single-column mobile cards

The original three suggestions were removed because their deadlines had passed. The tracker now includes only CFPs whose deadlines are still open and automatically hides an opportunity once its deadline passes.

## Sessionize coverage

`scripts/refresh_sessionize.py` scans every current public Sessionize sitemap entry with priority `0.8` or `0.5`, validates that its CFP is open, applies the deadline cutoff, and retains strong matches for Agentic AI, Azure, Copilot, AI engineering, RAG/MCP, Microsoft data, cloud, DevOps, and developer platforms. Private events hidden by organizer settings cannot be included.

## Run locally

```bash
python -m http.server 4177
```

Open <http://localhost:4177/>.

## Tests

```bash
npm test
```

The app has no runtime dependencies and needs no backend. All user data remains in the current browser unless exported.
