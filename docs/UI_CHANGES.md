# UI Changes

## What was updated
- Refined global UI tokens and base styles in `app/globals.css` (soft palette, spacing, shadows, typography rhythm, focus states, reusable utility classes).
- Upgraded reusable components in `components/ui/*`: `Button`, `Input`, `Textarea`, `Modal`, `BottomNav`, `Toaster` and added `Badge`, `Select`, `Drawer`, `Table`, `EmptyState`, `Skeleton`, `Alert`.
- Rebuilt public shell (`app/(public)/layout.tsx`) with responsive desktop top nav + mobile bottom nav.
- Redesigned landing page (`app/(public)/page.tsx`) with hero, live stats, features, how-it-works, CTA band, and footer links.
- Polished public pages:
  - `app/(public)/register/page.tsx`
  - `app/(public)/directory/page.tsx`
  - `app/(public)/events/page.tsx`
  - `app/(public)/events/[id]/page.tsx`
- Replaced admin shell with true dashboard structure via `components/admin/AdminShell.tsx` and `app/admin/layout.tsx`.
- Redesigned admin pages:
  - `app/admin/page.tsx` (KPIs, quick actions, recent members)
  - `app/admin/approvals/page.tsx` (desktop table + mobile cards)
  - `app/admin/members/page.tsx` (search, status filter, add/edit modal, uniqueness error visibility)
  - `app/admin/events/page.tsx` (search, responsive event cards)
  - `app/admin/events/new/page.tsx` (clean event form)
  - `app/admin/events/[id]/page.tsx` (two-column manage view, participant modal flow, sticky totals)
  - `app/admin/login/page.tsx`

## Where to test
- Public:
  - `/`
  - `/register`
  - `/directory`
  - `/events`
  - `/events/[id]`
- Admin:
  - `/admin/login`
  - `/admin`
  - `/admin/approvals`
  - `/admin/members`
  - `/admin/events`
  - `/admin/events/new`
  - `/admin/events/[id]`

## Responsive notes
- Targeted mobile-first behavior from 360px widths upward.
- Desktop/tablet breakpoints now use shared container widths (`page-container`) and consistent horizontal padding.
- Admin sidebar is fixed on desktop; mobile uses a drawer from the header menu button.
- List/table experiences provide desktop table layout and mobile card stack fallbacks where needed.
