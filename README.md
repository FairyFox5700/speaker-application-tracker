# Speaker Application Tracker

A local-first CFP and speaker-application pipeline focused on agentic systems, Azure, AI engineering, cloud/data, and developer audiences.

## Features

- Seven verified, currently open CFP opportunities matched to the niche
- Passed deadlines are excluded automatically
- Computed deadline urgency (never stored as a stale status)
- Application pipeline statuses and inline status updates
- Deterministic talk-to-CFP matching with visible reasons
- Search and combined status/deadline/priority filters
- Add, edit, and delete opportunities
- Browser persistence under `speakerTracker:v2`
- JSON backup/import and RFC 4180-compatible CSV export
- Responsive single-column mobile cards

The original three suggestions were removed because their deadlines had passed. The tracker now includes only CFPs whose deadlines are still open and automatically hides an opportunity once its deadline passes.

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
