# Kaalupi — Platform Kursus IT Indonesia

Platform kursus IT profesional: AI, Cyber Security, Networking, dan Programming — dalam bahasa Indonesia.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.4 (App Router + Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Font Nunito |
| Auth | Clerk v7 |
| Database | Supabase (PostgreSQL) |
| Payments | Midtrans Snap |

---

## Setup Lokal

```bash
npm install
# Buat .env dari contoh di bawah, isi nilainya
npm run dev
```

### Environment Variables

Buat file `.env` di root project (atau `.env.local`):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Midtrans (sandbox)
MIDTRANS_SERVER_KEY=Mid-server-...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-...
MIDTRANS_IS_PRODUCTION=false

# Email notification Gmail
EMAIL_USER=kaalupicourses@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

---

## ⚠️ Setup Supabase (WAJIB sebelum fitur jalan)

### Step 1 — Buat tabel (schema)

Di **Supabase Dashboard → SQL Editor**, jalankan:

```
supabase/schema.sql
```

### Step 2 — Tambahkan RLS Policies

Masih di **SQL Editor**, jalankan:

```
supabase/rls-policies.sql
```

File ini membuat:
- RLS policies untuk tabel `courses`, `enrollments`, `orders`, `progress`, `materials`
- Tabel baru **`waitlist`** beserta RLS policy-nya

> **Tanpa step ini, semua query Supabase akan gagal** karena RLS aktif tapi belum ada policy yang mengizinkan akses.

---

## Set Role Admin Clerk

```bash
node scripts/set-clerk-role.mjs kaalupicourses@gmail.com admin
# Lihat semua user:
node scripts/set-clerk-role.mjs --list
```

---

## Cara Deploy ke Vercel

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "feat: update brand Kaalupi + waitlist"
   git push origin master
   ```

2. **Buka [vercel.com](https://vercel.com) → New Project → Import repo**

3. **Tambahkan semua env vars** di Vercel Dashboard → Project → Settings → Environment Variables (pakai nilai production)

4. **Deploy** — Vercel otomatis build setiap push ke `master`

5. **Setelah deploy:**
   - Jalankan `supabase/schema.sql` dan `supabase/rls-policies.sql` di Supabase Dashboard
   - Set webhook Midtrans ke `https://domain-kamu.vercel.app/api/payment/notify`
   - Pastikan domain Vercel di-whitelist di Midtrans Dashboard → Settings → Access

6. **Set Clerk production keys** di Vercel env vars (ganti sandbox keys dengan production)

---

## Scripts

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `node scripts/set-clerk-role.mjs` | Set role user di Clerk |
