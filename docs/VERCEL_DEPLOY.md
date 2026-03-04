# Vercel Deploy Checklist

## 1) Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain, e.g. `https://ssc13.vercel.app`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

Notes:
- Generate `ADMIN_PASSWORD_HASH` with:
  - `node -e "require('bcrypt').hash('YOUR_PASSWORD', 10).then(console.log)"`
- In local `.env.local`, escape `$` in hash as `\$`.

## 2) Build/runtime

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: default (`.next`)

`postinstall` already runs `prisma generate`, so Prisma Client is ready on install.

## 3) Prisma MongoDB index sync

After first deploy (or schema change), sync schema/indexes:

- `npm run db:push`

Run from local machine or CI with production `DATABASE_URL`.

## 4) Smoke checks after deploy

- Public pages load: `/`, `/directory`, `/events`, `/register`
- Admin login works: `/admin/login`
- Create/edit event works (including image URL)
- Event image appears in:
  - landing upcoming banner
  - public events list + details
  - admin events list + details
