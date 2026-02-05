# Ninja Ops Console

A local-first project command center for OpenClaw-driven affiliate operations. Built with Next.js App Router, Prisma, SQLite, and Tailwind.

## Features
- Dashboard with today focus, approvals, and activity feed.
- Planner (daily + weekly) and Workboard (Kanban) views.
- Goals, Ideas inbox, Affiliate Library, Approvals queue.
- Secured Vault with client-side AES-GCM encryption and PBKDF2 key derivation.
- OpenClaw Artifacts import (manual paste + optional local file read).
- Command palette (Cmd/Ctrl + K), light/dark mode, mobile-responsive UI.

## Prerequisites
- Node.js LTS (18+)
- npm (bundled with Node.js)

## Install & Run
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

App runs at `http://localhost:3000`.

### Default login
- **Email:** admin@example.com
- **Password:** change-me

You will be prompted to change the password in **Settings → Account**.

## Database
- SQLite file stored at `prisma/dev.db` (configurable via `DATABASE_URL`).
- Prisma schema: `prisma/schema.prisma`.

## Security model & limitations
- Vault data is encrypted in the browser using AES-GCM with a key derived from a Vault Master Password (PBKDF2).
- Only encrypted payload + metadata are stored in SQLite.
- The master password is never stored.
- Vault auto-locks after 10 minutes of inactivity.
- **Limitations:** This is a local vault. Protect your machine, rotate secrets, and use 2FA on upstream services.

## OpenClaw integration
### Manual mode (portable)
Paste artifact content directly into the Artifacts panel in Settings.

### Local file mode (same machine/server)
Configure paths in Settings → Preferences. Then use **Import file** to read a path via `/api/artifacts`.
- This uses Node.js file access, so only works when the app runs on the same machine with file permissions.
- Configure paths per environment; do not assume OS defaults.

## Project structure
```
app/                # Next.js App Router UI + API
components/         # Reusable UI components
lib/                # Prisma + auth helpers
prisma/             # Schema + seed
```

## Deployment notes (optional)
- Set `DATABASE_URL` to a persistent path on your server.
- Run `npm run prisma:migrate` before `npm run build`.

## Verification checklist
- [ ] `npm run prisma:migrate` completed without errors
- [ ] `npm run seed` loaded demo data
- [ ] Able to login with default credentials
- [ ] Vault unlock/encrypt/decrypt tested locally
- [ ] OpenClaw artifact import validated
