# Ninja Ops Console

A local-first, cabinet-style creative operations console for OpenClaw-driven affiliate work. Built with Next.js App Router, Prisma, SQLite, and Tailwind.

## Features
- Cabinet home with calm, card-based compartments and priority lenses.
- Planner (daily + weekly) and Workboard (soft Kanban) views.
- Ideas inbox, Affiliate Library, Approvals queue, Budget console, and Reports shelf.
- Secured Vault with client-side AES-GCM encryption and PBKDF2 key derivation.
- OpenClaw Artifacts import (manual paste + optional local file read).
- Command palette (Cmd/Ctrl + K), warm dark-first UI, mobile-responsive layout.

## Product philosophy
This UI is optimized for highly visual, creative operators:
- **Warm, dark-first atmosphere** to reduce glare and cognitive load.
- **Cabinet metaphor** to keep mental domains separated and recognizable.
- **Cards over tables** with clear spacing to anchor attention.
- **Priority lenses** (Urgency / Leverage / Calm) to change emphasis without clutter.

For full design tokens and cabinet guidance, see `DESIGN.md`.

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

## Roles
- **OWNER** can access the Vault and edit Budget limits + currency.
- **OPERATOR** can add expenses and read budget summaries but cannot access the Vault or edit limits.

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

## Run locally
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Run in production
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run start
```
