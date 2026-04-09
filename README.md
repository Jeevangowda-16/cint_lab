# CINT Lab Website (Local Data Mode)

This project is now fully local-data-driven and runs offline without Firebase.

## What changed

- Firestore replaced with a local data store backed by:
  - `src/data/data.json` (seed dataset)
  - browser `localStorage` (runtime persistence)
- Firebase Auth removed:
  - admin routes are available locally without login
- Firebase SDK usage removed from runtime app code (`src/`)
- Service layer kept intact, but now reads/writes local data through `src/lib/localDataStore.js`

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

## Notes

- Runtime app features are fully offline and self-contained.
- `.env.local` is optional and does not require any cloud keys.
- Deprecated cloud/Firebase scripts have been removed from `scripts/`.
