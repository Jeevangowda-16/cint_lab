# CINT Lab Website (Local Data Mode)

This project is now local-data-driven for content and admin CRUD, with server-side email delivery for internship applications.

## What changed

- Firestore replaced with a local data store backed by:
  - `src/data/data.json` (seed dataset)
  - browser `localStorage` (runtime persistence)
- Firebase Auth removed:
  - admin routes are available locally without login
- Firebase SDK usage removed from runtime app code (`src/`)
- Service layer kept intact, but now reads/writes local data through `src/lib/localDataStore.js`
- Internship application form now sends submissions to Gmail via a Next.js API route

## Data source

- Seed file: `src/data/data.json`
- Local runtime key: `cint-lab-local-data-v1`
- Collections preserved:
  - `lab_overview`
  - `projects`
  - `team`
  - `interns`
  - `events`
  - `applications`
  - `contacts`
  - `publications`
  - `form_config`

## Behavior

- Public pages and admin pages read from local data.
- Admin CRUD operations persist to browser localStorage and remain visible immediately.
- Project detail and people views resolve intern project labels via `projectId` linkage.

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

No `.env.local` is required.

## Internship application email setup

The Apply for Internship page sends submissions to Gmail.

Create `.env.local` with:

```bash
GMAIL_USER=sender-account@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
GMAIL_TO=jeevangowda1622@gmail.com
```

Notes:

- `GMAIL_USER` must be a Gmail account with 2-Step Verification enabled.
- `GMAIL_APP_PASSWORD` must be a Gmail App Password (not your normal Gmail password).
- `GMAIL_TO` is optional; if omitted, the app defaults to `jeevangowda1622@gmail.com`.

## Notes

- Runtime app features are fully offline and self-contained.
- `.env.local` is optional and does not require any cloud keys.
- Deprecated cloud/Firebase scripts have been removed from `scripts/`.
