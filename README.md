# SSC Batch 2013 — Community Portal

A production-ready mobile-first web app for the SSC Batch 2013 community. Built with **Next.js 16** (App Router), **Prisma + MongoDB**, **NextAuth v4**, **Tailwind CSS**, and **Zod**.

---

## Features

- 📋 **Member Directory** — approved members with search
- 📝 **Self-Registration** — pending → admin approves → appears in directory
- 🎉 **Events** — admin creates events, manages participants with contribution & remarks
- 🔐 **Admin Panel** — protected by NextAuth credentials (bcrypt password, env config)
- 📱 **Mobile-first** — bottom navigation, bottom sheet modals

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Random secret (min 32 chars) — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL (e.g. `http://localhost:3000`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (escape `$` as `\\$`) |

### Generate Password Hash

```bash
node -e "require('bcrypt').hash('YOUR_PASSWORD', 10).then(console.log)"
```

Paste the output as `ADMIN_PASSWORD_HASH` in `.env.local`.

---

## Setup Steps

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Prisma Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB (creates indexes)
npx prisma db push
```

> **Note:** MongoDB with Prisma does not use `migrate`. Use `db push` instead.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  (public)/          ← public pages with BottomNav
    page.tsx          / landing
    register/         /register
    directory/        /directory
    events/           /events + /events/[id]
  admin/              ← protected admin pages
    login/            /admin/login
    page.tsx          /admin dashboard
    approvals/        /admin/approvals
    members/          /admin/members
    events/           /admin/events + new + [id]
  api/
    register/         POST public registration
    members/          GET approved members
    events/           GET events + [id]
    admin/            ← all require auth session
      members/        GET+POST; [id] PATCH+DELETE; approve/reject
      events/         GET+POST; [id] PATCH+DELETE; participants PUT+DELETE
components/ui/      ← Button, Input, Textarea, Card, Modal, Toaster, BottomNav
lib/
  auth.ts             NextAuth v4 config
  prisma.ts           Prisma singleton
  phone.ts            BD phone normalization
  schemas.ts          Zod schemas
middleware.ts         Route protection for /admin/*
prisma/schema.prisma  Member, Event, EventParticipant models
```

---

## API Reference

### Public
| Method | Route | Description |
|---|---|---|
| POST | `/api/register` | Self-register (status=PENDING) |
| GET | `/api/members?q=` | Approved members with optional search |
| GET | `/api/events` | All events |
| GET | `/api/events/[id]` | Event detail with participants |

### Admin (requires session)
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/members?status=&q=` | All members with filters |
| POST | `/api/admin/members` | Create approved member |
| PATCH | `/api/admin/members/[id]` | Edit member |
| DELETE | `/api/admin/members/[id]` | Delete member |
| PATCH | `/api/admin/members/[id]/approve` | Approve registration |
| PATCH | `/api/admin/members/[id]/reject` | Reject registration |
| GET | `/api/admin/events` | All events |
| POST | `/api/admin/events` | Create event |
| PATCH | `/api/admin/events/[id]` | Edit event |
| DELETE | `/api/admin/events/[id]` | Delete event |
| PUT | `/api/admin/events/[id]/participants` | Upsert participant (contribution+remarks) |
| DELETE | `/api/admin/events/[id]/participants/[memberId]` | Remove participant |

---

## Deployment (Vercel + MongoDB Atlas)

1. **MongoDB Atlas**: Create free cluster → get connection string
2. **Vercel**:
   - Import your GitHub repo
   - Set all env vars in Vercel dashboard (same as `.env.local`)
   - Set `NEXTAUTH_URL` to your Vercel deployment URL
3. **Build Settings**:
   - Framework preset: `Next.js`
   - Install command: `npm install`
   - Build command: `npm run build`
4. **After deploy**: Run `npm run db:push` once to create indexes
5. **Auth sanity check**:
   - Ensure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` exist in Vercel env vars
   - Redeploy after changing auth env vars

---

## Smoke Test Checklist

After running `npm run dev`:

- [ ] **Landing page** loads at `http://localhost:3000` with SSC logo, two nav cards, Register CTA
- [ ] **Register**: Go to `/register`, submit a form → success message shown
- [ ] **Admin login**: Go to `/admin/login`, log in with configured email/password → redirected to `/admin`
- [ ] **Admin dashboard**: Shows stat cards — member counts, pending count
- [ ] **Approvals**: Go to `/admin/approvals` → see registered member → click Approve → member moves to approved
- [ ] **Directory**: Go to `/directory` → approved member appears, search works
- [ ] **Admin Members**: Go to `/admin/members` → member visible → Add new member (provides phone normalization), Edit, Delete work
- [ ] **Duplicate phone**: Try registering with same phone → 409 Conflict error shown
- [ ] **Create Event**: Go to `/admin/events` → New → fill form → event created
- [ ] **Manage Participants**: In `/admin/events/[id]`, search for a member → Add → enter contribution (e.g. 500), remarks → Add to Event → participant appears in list with contribution
- [ ] **Edit Participant**: Click Edit on participant → change contribution → Update → reflects immediately
- [ ] **Remove Participant**: Click Remove → participant gone, total updates
- [ ] **Public Event Detail**: Go to `/events/[id]` → see participants and total contribution
- [ ] **Sign out**: Click Sign Out → redirected to login

---

## Phone Normalization

`lib/phone.ts` normalizes BD phone numbers:

| Input | Normalized |
|---|---|
| `01712345678` | `+8801712345678` |
| `8801712345678` | `+8801712345678` |
| `+8801712345678` | `+8801712345678` |
| `017-1234-5678` | `+8801712345678` |
