# Speaker Application Tracker

A local-first CFP and speaker-application pipeline focused on agentic systems, Azure, AI engineering, cloud/data, and developer audiences.

## Features

- Three supplied CFP opportunities as seed data
- Computed deadline urgency (never stored as a stale status)
- Application pipeline statuses and inline status updates
- Deterministic talk-to-CFP matching with visible reasons
- Search and combined status/deadline/priority filters
- Add, edit, and delete opportunities
- Browser persistence under `speakerTracker:v1`
- JSON backup/import and RFC 4180-compatible CSV export
- Responsive single-column mobile cards

> As of 2026-10-31, all three supplied CFP deadlines have passed. The tracker shows them honestly as passed while preserving the original “CFP open” source label in exported data.

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
