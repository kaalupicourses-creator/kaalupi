# Kaalupi - Complete Project Context & Progress

## Project Overview
**Kaalupi** is a professional IT course platform built with Next.js 16, featuring role-based access, Midtrans payments, Supabase database, and Clerk authentication. The platform supports three user roles: **admin**, **instructor**, and **student**.

## Tech Stack
- **Framework:** Next.js 16.2.4 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Auth:** Clerk v7.3.0
- **Database:** Supabase (PostgreSQL)
- **Payments:** Midtrans (Sandbox mode)
- **React:** 19.2.4

## Environment Variables (Current .env)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bHVja3ktb3J5eC0yOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_Sm1ozdMGIsgFwyguSu6i7GVVeGpnImNjh8JQZ1Rks3

# Session (legacy - will be removed)
KAALUPI_SESSION_SECRET=replace-with-a-long-random-secret

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://qktjckfirtvpytabbene.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdGpja2ZpcnR2cHl0YWJiZW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MDAxNjQsImV4cCI6MjA5MzM3NjE2NH0.hi1qN4ByoQq9qbjSmBfRpI9Sqlz5zyWvSOhIBmx7kE

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-JHxXy2DsOmLgbWay
MIDTRANS_IS_PRODUCTION=false
```

## Active Clerk User
| Email | Role | Status |
|---|---|---|
| kaalupicourses@gmail.com | admin | Created via dashboard, metadata set |

## Supabase Database Tables
| Table | Purpose | Row Level Security |
|---|---|---|
| `courses` | Course catalog data | ✅ Enabled - needs public read policy |
| `enrollments` | User-course access mapping | ✅ Enabled - needs user read policy |
| `orders` | Payment order records | ✅ Enabled - needs user read policy |
| `progress` | Module completion tracking | ✅ Enabled - needs user access policy |
| `materials` | Course content (video URLs, articles) | ✅ Enabled - needs public read policy |

### Seed Data (4 courses in Supabase)
1. **Fullstack Web Engineer** - Programming, Intermediate, 16 weeks, Rp 2,490,000
2. **Network Engineer Pro** - Network Engineer, Beginner to Advanced, 14 weeks, Rp 2,190,000
3. **Cyber Security Analyst** - Cyber Security, Intermediate, 12 weeks, Rp 2,790,000
4. **Product UI Designer** - Designer, Beginner, 10 weeks, Rp 1,890,000

### Known Supabase RLS Issue
RLS policies were NOT included in the initial migration. Add these SQL policies in Supabase Dashboard → SQL Editor:
```sql
-- Enable public read access for courses
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);

-- Allow read access for enrollments, orders, progress, materials
CREATE POLICY "Users can view enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Users can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can view progress" ON progress FOR SELECT USING (true);
CREATE POLICY "Users can view materials" ON materials FOR SELECT USING (true);

-- Allow insert for all tables
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create progress" ON progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create materials" ON materials FOR INSERT WITH CHECK (true);

-- Allow update for orders and progress
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Users can update their own progress" ON progress FOR UPDATE USING (true);
```

## Current Payment Flow Status

### How It Should Work
1. User clicks "Bayar Course" on checkout page
2. `/api/checkout` creates order in Supabase + calls Midtrans Snap API
3. Midtrans Snap popup appears in browser (uses `window.snap.pay()`)
4. User completes test payment (sandbox mode - no real money)
5. On success, redirect to `/payment/result` with order params
6. `/api/payment/finalize` verifies with Midtrans API + creates enrollment
7. User can now access course via `/access/[slug]`

### Current Issue
Checkout button shows "Terjadi kesalahan saat checkout" error. Likely causes:
- Midtrans Snap JS may not be loading properly (Script tag in layout.tsx)
- Midtrans API call to create transaction may be failing
- RLS blocking the course query in `/api/checkout`

### Checkout Button Implementation
- Component: `src/components/checkout-button.tsx`
- Uses Midtrans Snap popup via `window.snap.pay(token, options)`
- Callbacks: onSuccess, onPending, onError, onClose → all redirect to `/payment/result`
- Midtrans Snap script loaded via `<Script>` in `src/app/layout.tsx`

### Midtrans Test Payment Methods
- **GoPay/OVO/ShopeePay**: Click "Simulate payment" button
- **Credit Card**: `4811 1111 1111 1114`, expiry `12/2030`, CVV `123`
- **Bank Transfer**: Use test VA numbers from Midtrans docs

## Project Structure
```
kaalupi/
├── .env                              # Environment variables (sensitive!)
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── IMPLEMENTATION_PROGRESS.md        # This file
├── PROJECT_OVERVIEW.md               # Vision, mission, concept
├── DESIGN_RESEARCH.md                # Platform analysis (Coursera, Udemy, etc.)
├── AGENTS.md                         # AI agent instructions
│
├── public/
│   ├── og.jpg                        # Open Graph image
│   └── favicon.ico
│
├── scripts/
│   └── set-clerk-role.mjs            # CLI script to set user roles
│     Usage: node scripts/set-clerk-role.mjs <email> <role>
│            node scripts/set-clerk-role.mjs --list
│
├── supabase/
│   └── schema.sql                    # Database migration + seed data
│
└── src/
    ├── proxy.ts                      # Clerk middleware (route protection)
    │
    ├── app/
    │   ├── layout.tsx                # Root layout with ClerkProvider + Midtrans Snap
    │   ├── globals.css               # Tailwind CSS v4 styles
    │   ├── page.tsx                  # Landing page (hero, partners, how it works, spotlight, CTA)
    │   ├── not-found.tsx             # 404 page
    │   │
    │   ├── about/page.tsx            # About Us page
    │   ├── contact/page.tsx          # Contact form page
    │   │
    │   ├── login/[[...sign-in]]/page.tsx  # Clerk SignIn (catch-all route)
    │   │
    │   ├── courses/page.tsx          # Course catalog with filter pills
    │   ├── courses/[slug]/page.tsx   # Course detail (split layout, outcomes, modules, pricing)
    │   │
    │   ├── checkout/[slug]/page.tsx  # Checkout page (split layout, pricing card)
    │   │
    │   ├── access/page.tsx           # My Access page (enrolled courses grid)
    │   ├── access/[slug]/page.tsx    # Course access page (content, progress)
    │   │
    │   ├── payment/result/page.tsx   # Payment result page (loading/success/error states)
    │   │
    │   ├── blog/page.tsx             # Blog list (2-column grid)
    │   ├── blog/[slug]/page.tsx      # Blog detail
    │   │
    │   ├── dashboard/page.tsx        # User dashboard (stats, enrolled courses)
    │   ├── dashboard/content/new/page.tsx  # Admin/instructor course publish form
    │   │
    │   └── api/
    │       ├── checkout/route.ts     # POST: Create order + Midtrans Snap transaction
    │       ├── materials/route.ts    # POST: Create new course (admin/instructor only)
    │       └── payment/
    │           ├── finalize/route.ts # POST: Verify payment status + create enrollment
    │           └── notify/route.ts   # POST: Midtrans webhook handler
    │
    ├── components/
    │   ├── site-header.tsx           # Navigation header
    │   ├── site-footer.tsx           # Footer with links
    │   ├── course-card.tsx           # Course catalog card with thumbnail
    │   ├── course-thumbnail.tsx      # Auto-generated gradient + icon per category
    │   ├── checkout-button.tsx       # Midtrans Snap integration button
    │   ├── payment-finalizer.tsx     # Payment result display component
    │   ├── material-form.tsx         # Course publish form (admin/instructor)
    │   ├── role-badge.tsx            # Role display badge
    │   ├── video-player.tsx          # Video player component (unused)
    │   ├── progress-tracker.tsx      # Module completion tracker
    │   └── illustrations/
    │       ├── hero-learning.tsx     # Custom SVG: person learning
    │       ├── cta-community.tsx     # Custom SVG: community chat
    │       └── partner-logos.tsx     # Partner company logos grid
    │
    └── lib/
        ├── data.ts                   # Static data (blog posts, site config)
        ├── content.ts                # Course data fetcher (Supabase → fallback seed)
        ├── db.ts                     # Supabase CRUD functions
        ├── supabase.ts               # Supabase client + TypeScript types
        ├── auth.ts                   # Auth logic (Clerk sessions → Supabase)
        └── midtrans.ts               # Midtrans API integration (create transaction, verify, status)
```

## Route Protection (proxy.ts)
- Protected: `/dashboard(.*)`, `/access(.*)` → requires Clerk auth
- API routes: `/api/(.*)` → requires auth except `/api/payment/notify`
- Public: All other routes (landing, courses, blog, about, contact, login)

## Clerk User Metadata
Role is stored in Clerk's `publicMetadata.role` field. Retrieved via:
```typescript
const { sessionClaims } = await auth();
const role = (sessionClaims?.metadata as { role?: string })?.role ?? "student";
```

## Design System
- **Colors:** Dark theme (`#08111d` background), amber/orange accents (`#f97316`, `#facc15`)
- **Typography:** System font stack, white text on dark backgrounds
- **Cards:** `rounded-2xl` / `rounded-[2rem]`, `border-white/10`, `bg-white/5`
- **Buttons:** `rounded-full`, gradient orange-yellow for primary, border for secondary
- **Thumbnails:** Auto-generated gradient + icon per category:
  - Programming → Blue/cyan
  - Network Engineer → Indigo/purple
  - Cyber Security → Red/rose
  - Designer → Pink/fuchsia
  - Default → Orange/yellow

## All Pages Status
| Page | Status | Notes |
|---|---|---|
| Landing (`/`) | ✅ Polished | Hero split, partners, how it works, spotlight, CTA |
| Courses (`/courses`) | ✅ Polished | Centered header, filter pills, grid layout |
| Course Detail (`/courses/[slug]`) | ✅ Polished | Split hero, breadcrumb, sticky pricing |
| Checkout (`/checkout/[slug]`) | ✅ Polished | Split layout, pricing card, trust badges |
| Access (`/access`) | ✅ Polished | Grid with thumbnails, info badges |
| Access Detail (`/access/[slug]`) | ✅ Polished | Progress bar, module list, course info |
| Dashboard (`/dashboard`) | ✅ Polished | Stats cards, enrolled courses grid |
| Content New (`/dashboard/content/new`) | ✅ Polished | Form with labels, helpers |
| Login (`/login/[[...sign-in]]`) | ✅ Polished | Split layout, feature highlights |
| Blog (`/blog`) | ✅ Polished | 2-column grid, colored badges |
| Blog Detail (`/blog/[slug]`) | ✅ Polished | Meta, read time, CTA section |
| About (`/about`) | ✅ Polished | Centered hero, vision/mission |
| Contact (`/contact`) | ✅ Polished | Info cards, form with labels |
| Payment Result (`/payment/result`) | ✅ Polished | 3 states with icons |
| 404 (`/not-found`) | ✅ Done | Basic 404 page |

## Build & Lint Status
- `npm run build` → ✅ Pass
- `npm run lint` → ✅ Pass (no errors, no warnings)

## Known Issues & TODOs

### Critical (Must Fix Before Production)
1. **Supabase RLS Policies** - Not yet added to database. Without these, all queries fail.
2. **Midtrans Snap Integration** - Checkout button error, Snap popup not opening. Needs debugging.
3. **Payment Webhook** - Not yet configured in Midtrans Dashboard (needs deployed URL).

### Important
4. **Vercel Deployment** - Project not yet deployed. Manual setup needed.
5. **Midtrans Production Keys** - Currently using sandbox. Need production keys for real payments.
6. **Clerk Production Keys** - Currently using test keys. Need production keys for real auth.

### Nice to Have
7. **Video Storage** - Need Supabase Storage / Cloudflare R2 / AWS S3 for video content.
8. **Email Notifications** - No email system for payment confirmation, enrollment, etc.
9. **Admin Analytics** - No dashboard for monitoring transactions, users, revenue.
10. **SEO Optimization** - Meta tags need more detail, sitemap/robots.txt missing.
11. **Performance** - Image optimization, lazy loading, code splitting can be improved.

## Scripts
| Script | Purpose | Usage |
|---|---|---|
| `npm run dev` | Start dev server | `npm run dev` |
| `npm run build` | Production build | `npm run build` |
| `npm run start` | Start production server | `npm run start` |
| `npm run lint` | Run ESLint | `npm run lint` |
| `set-clerk-role.mjs` | Set user role in Clerk | `node scripts/set-clerk-role.mjs <email> <role>` |
| `set-clerk-role.mjs --list` | List all Clerk users | `node scripts/set-clerk-role.mjs --list` |

## Deployment Checklist
- [ ] Fix Supabase RLS policies
- [ ] Fix Midtrans Snap integration
- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel (use production keys)
- [ ] Deploy
- [ ] Set Midtrans webhook URL to `https://yourdomain.com/api/payment/notify`
- [ ] Test full payment flow in production
- [ ] Set up custom domain (optional)

## Quick Start for New AI/Developer
1. `npm install`
2. Copy `.env` and fill in your keys (or use existing ones if provided)
3. Run SQL migration in Supabase Dashboard (`supabase/schema.sql`)
4. Add RLS policies (see "Known Supabase RLS Issue" section above)
5. `npm run dev`
6. Open `http://localhost:3000`

## Key Files to Know
| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout, ClerkProvider, Midtrans Snap script |
| `src/proxy.ts` | Route protection middleware |
| `src/lib/db.ts` | All Supabase CRUD operations |
| `src/lib/midtrans.ts` | Midtrans API integration |
| `src/lib/content.ts` | Course data fetcher (Supabase → fallback) |
| `src/components/checkout-button.tsx` | Payment button with Snap popup |
| `src/app/api/checkout/route.ts` | Order creation + Snap transaction |
| `supabase/schema.sql` | Database schema + seed data |
| `.env` | All environment variables |

## Last Updated
2026-05-03 — All pages polished, Supabase connected, Clerk configured, Midtrans keys added, Snap integration in progress.
