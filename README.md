# CINT Lab Website

Firebase-ready, service-driven lab website built with Next.js and Tailwind CSS.

## Core Design

This codebase is refactored around a centralized data layer so content is never hardcoded in route components.

- All runtime content is read from Firestore.
- Contact and internship application forms write directly to Firestore.
- Form option lists are read from `form_config/default` in Firestore.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Firebase SDK (Firestore and optional Auth)

## Updated Folder Structure

```text
src/
	app/
		apply/page.jsx
		contact/page.jsx
		events/page.jsx
		interns/page.jsx
		projects/page.jsx
		publications/page.jsx
		research/page.jsx
		team/page.jsx
		page.js
	components/
		footer.jsx
		navbar.jsx
	config/
		dataSource.js
	hooks/
		useAsyncData.js
	lib/
		firebase.js
	services/
		applicationService.js
		contactService.js
		eventService.js
		helpers.js
		internService.js
		labService.js
		projectService.js
		publicationService.js
		teamService.js
```

Additional admin/auth files:

- `src/app/login/page.jsx`
- `src/app/admin/layout.jsx`
- `src/app/admin/page.jsx`
- `src/app/admin/projects/page.jsx`
- `src/app/admin/team/page.jsx`
- `src/app/admin/interns/page.jsx`
- `src/app/admin/events/page.jsx`
- `src/app/admin/applications/page.jsx`
- `src/app/admin/contacts/page.jsx`
- `src/lib/authContext.jsx`
- `src/hooks/useAdminAuth.js`
- `middleware.js`
- `firestore.rules`

## Firestore Schema Design

Use these collections for production data:

1. `lab_overview`
- `title`, `subtitle`, `mission`, `highlights[]`, `ctas[]`, `contact{}`, `updatedAt`

2. `projects`
- `title`, `slug`, `summary`, `description`, `tags[]`, `status`, `leadIds[]`, `startDate`, `endDate`, `links[]`, `createdAt`, `updatedAt`

3. `team`
- `name`, `roleCategory` (`lead|associate|alumni`), `designation`, `bio`, `email`, `photoUrl`, `researchAreas[]`, `active`, `sortOrder`, `createdAt`, `updatedAt`

4. `interns`
- `name`, `program`, `cohort`, `mentorId`, `focusArea`, `startDate`, `endDate`, `status`, `profileUrl`, `createdAt`, `updatedAt`

5. `events`
- `title`, `type`, `description`, `speaker`, `location`, `eventDate`, `registrationUrl`, `isFeatured`, `createdAt`, `updatedAt`

6. `applications`
- `fullName`, `email`, `phone`, `institution`, `programLevel`, `interests[]`, `statement`, `resumeUrl`, `status`, `submittedAt`

7. `contacts`
- `fullName`, `email`, `subject`, `message`, `category`, `status`, `submittedAt`

8. `publications` (optional, already service-ready)
- `year`, `title`, `authors`, `venue`, `link`, `createdAt`, `updatedAt`

9. `form_config`
- `internshipInterestOptions[]`, `contactSubjectOptions[]`, `updatedAt`

## Service Layer Contract

All content and writes are routed through services in `src/services/`.

Required CRUD-ready services:

- `projectService.js`: `getProjects`, `addProject`, `updateProject`, `deleteProject`
- `teamService.js`: `getTeamMembers`, `addTeamMember`, `updateTeamMember`, `deleteTeamMember`
- `internService.js`: `getInterns`, `addIntern`, `updateIntern`, `deleteIntern`
- `eventService.js`: `getEvents`, `addEvent`, `updateEvent`, `deleteEvent`

Additional services:

- `labService.js`: lab overview read/update
- `applicationService.js`: internship application submit/list/update
- `contactService.js`: contact submit/list/update
- `publicationService.js`: publications read/write support

## Data Source Switching

Data source behavior is controlled in `src/config/dataSource.js`.

```js
export const SHOULD_USE_FIREBASE = isFirebaseConfigured;
export const ACTIVE_DATA_SOURCE = "firestore";
```

Runtime behavior:

- App is Firebase-only at runtime.
- Firebase env vars must be configured for data reads/writes.

## Firebase Setup (When Ready)

1. Add `.env.local` with:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

2. Ensure Firestore collections exist according to the schema above.
3. Run `npm run dev` and verify reads/writes.

## Forms Behavior

- `Contact` form writes to `contacts` and loads subject options from `form_config/default`.
- `Apply` form writes to `applications` and loads interest options from `form_config/default`.

## Admin Access and Role Guard

A protected admin surface now exists under `/admin` and is guarded by Firebase Authentication and custom claims.

- Route guard: `src/app/admin/layout.jsx`
- Login route: `src/app/login/page.jsx`
- Admin dashboard: `src/app/admin/page.jsx`
- Admin CRUD routes:
  - `/admin/projects`
  - `/admin/team`
  - `/admin/interns`
  - `/admin/events`
  - `/admin/applications`
  - `/admin/contacts`

Guard behavior:

- Unauthenticated users are redirected to `/login`.
- Authenticated users without `admin: true` claim are redirected to `/`.
- Authenticated admins can access all admin routes.

## Admin Claim Setup (Multiple Admins)

Use Firebase custom claims to grant admin rights.

1. Assign claim to each admin account with Firebase Admin SDK:

```js
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

2. Revoke access when needed:

```js
await admin.auth().setCustomUserClaims(uid, { admin: false });
```

3. Ask affected users to sign out/in after claim changes so ID tokens refresh.

## Firestore Security Rules Enforcement

Rules are defined in `firestore.rules`.

Policy summary:

- Public read + admin write: `lab_overview`, `projects`, `team`, `interns`, `events`, `publications`
- Public create + admin read/update/delete: `applications`, `contacts`
- Default deny for all unspecified paths

Deploy rules with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
