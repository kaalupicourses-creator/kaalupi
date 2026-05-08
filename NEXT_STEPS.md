# Kaalupi — Next Steps (After Studio Upgrade)

> Tanggal: 8 Mei 2026
> Status: Course Studio v1 ready, automation foundation siap dipake.

---

## ⚡ QUICK WINS YANG SUDAH DIBERESIN

### ✅ Bug Fixes
- [x] **56 → 14 materials**: duplikat dihapus dari DB
- [x] **Unique constraint** ditambah ke `materials (course_slug, module_index, order_index)` — ngga akan duplikat lagi
- [x] **Endpoint POST upsert** otomatis update kalau posisi sama

### ✅ New Features
- [x] **Course Studio** di `/dashboard/studio` — satu halaman buat list, edit, delete, reorder, preview semua materi
- [x] **AI Generate Materi** pakai Claude API — auto-tulis materi HTML dari topik
- [x] **Bulk Import JSON** — paste JSON array, langsung masuk semua
- [x] **Move up/down** materi via tombol panah
- [x] **API PATCH + DELETE** untuk single material
- [x] **2 Vercel Cron**:
  - `/api/cron/re-engage` — daily 09:00 UTC, deteksi student stuck >7 hari
  - `/api/cron/weekly-digest` — Senin 08:00 UTC, KPI mingguan

---

## 🔧 SETUP YANG MASIH HARUS LU LAKUIN (sekali aja)

### 1. Anthropic API Key (untuk AI Generate)
```
1. Buka https://console.anthropic.com → Sign up (free $5 credit)
2. Settings → API Keys → Create Key
3. Copy ke .env: ANTHROPIC_API_KEY=sk-ant-xxx
4. Add ke Vercel: Vercel Dashboard → Project → Settings → Environment Variables
```
**Cost estimate**: 1 generate materi medium ≈ $0.005 (≈ Rp 80). $5 free = 1000 materi.

### 2. Supabase Service Role Key (WAJIB)
Studio butuh service role buat bypass RLS. Ambil di:
```
Supabase Dashboard → Project Settings → API → service_role secret (di-blur, klik untuk reveal)
→ Copy ke .env: SUPABASE_SERVICE_ROLE_KEY=eyJ...
→ Sync ke Vercel env vars juga
```

### 3. Cron Secret
```bash
# Generate random string 32 char
openssl rand -hex 32
# Atau di Windows PowerShell:
[Convert]::ToBase64String((1..24 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))
```
Set di `.env`: `CRON_SECRET=<hasil-generate>`. Add ke Vercel juga.

Vercel Cron akan auto-pakai secret ini lewat header Authorization.

### 4. (Optional) Webhook Automation — n8n / Make.com
**Ini bagian yang bikin lu auto-pilot.**

Recommended: **n8n cloud free tier** (5000 workflow/bulan gratis) atau self-host n8n di Railway/Render.

Workflow contoh yang harus lu setup:
- **Webhook A** — terima event `re_engage` dari `/api/cron/re-engage`:
  → kirim WhatsApp via Fonnte/Wablas API
  → atau email via Resend/SendGrid
  → atau Telegram bot
- **Webhook B** — terima event `weekly_digest`:
  → email founder dengan KPI
  → posting summary ke Discord/Slack tim
- **Webhook C** (manual trigger) — sync TikTok/Instagram analytics ke Google Sheets

Tinggal isi env:
```
REENGAGE_WEBHOOK_URL=https://n8n.kaalupi.com/webhook/reengage
WEEKLY_DIGEST_WEBHOOK_URL=https://n8n.kaalupi.com/webhook/digest
```

---

## 📝 CARA PAKAI COURSE STUDIO (Workflow Harian)

### Input materi "AI untuk Pemula" yang udah ada
1. Login ke `/login` → role harus admin/instructor
2. `/dashboard` → klik tombol **🎬 Course Studio**
3. Pilih course "AI untuk Pemula" di sidebar
4. Klik modul yang mau diisi (1-5)
5. **3 cara input:**
   - **Manual**: Klik "+ Tambah Materi" → isi judul, video URL, content HTML
   - **AI Generate**: Klik "🤖 AI Generate" → masukkan topik → AI nulis HTML otomatis
   - **Bulk Import**: Klik "📥 Bulk Import" → paste JSON array

### Format JSON Bulk Import (untuk yang udah punya draft di Notion/Google Doc)
```json
[
  {
    "title": "Apa itu LLM?",
    "module_index": 0,
    "order_index": 0,
    "video_url": "https://youtube.com/watch?v=xxx",
    "content": "<h2>LLM</h2><p>Large Language Model adalah...</p>"
  },
  {
    "title": "Cara kerja transformer",
    "module_index": 0,
    "order_index": 1,
    "video_url": "",
    "content": "<h2>Transformer</h2><p>...</p>"
  }
]
```

### Edit / Delete / Reorder
- Hover materi → muncul tombol ↑↓ buat reorder
- Klik **Edit** → buka editor inline
- Klik **Hapus** → confirm → langsung gone

---

## 🤖 AUTOMATION YANG GW SARANIN BUAT LU SETUP NEXT

### Tier 1 — Wajib (Free, no budget)
1. **n8n Cloud** (free 5000 workflow/bulan) atau **Make.com** (1000 free)
2. **Fonnte WhatsApp API** (free 100 pesan/bulan) untuk re-engage student
3. **Resend** (3000 email/bulan free) untuk welcome + digest email
4. **Plausible** atau **Vercel Analytics** (free) untuk web analytics

### Tier 2 — Recommended (kalau revenue mulai jalan)
1. **Loops.so** (3000 contact free) — better untuk drip email campaign
2. **Beehiiv** atau **Substack** — newsletter
3. **Crisp Chat** (free) — live chat support
4. **Tally** (free unlimited form) — survey & feedback

### Tier 3 — Long-term (after Rp 5jt/bulan revenue)
1. **PostHog** — product analytics + feature flags
2. **Mixpanel** — funnel analysis
3. **Segment** — single source of truth untuk data
4. **Stripe** (kalau go international) untuk subscription

---

## 🚧 YANG BELUM GW BERESIN — Roadmap

### Sprint 2 (Minggu Depan)
- [ ] **Storage video upload** — sekarang masih URL aja, harusnya bisa upload langsung ke Supabase Storage
- [ ] **Course Editor** — sekarang course masih di-hardcode di `data.ts`. Bikin UI buat tambah course baru juga
- [ ] **AI Tutor Chat** — chat box di halaman `/access/[slug]` yang nanya jawaban AI berdasarkan materi modul
- [ ] **Auto-quiz generate** — AI bikin 5-10 quiz per modul

### Sprint 3
- [ ] **Email automation** — welcome series 5 email setelah signup waitlist
- [ ] **WhatsApp re-engage** — integrasi Fonnte/Wablas
- [ ] **Cohort feature** — start_date, end_date, max_seats per course
- [ ] **Live session calendar** — embed Google Meet/Zoom link per cohort

### Sprint 4
- [ ] **B2B portal** — corporate signup flow + admin panel buat manage employees
- [ ] **Analytics dashboard** — graph revenue, signup funnel, completion rate
- [ ] **Public profile + portfolio** — student bisa share certificate + project

---

## 🎯 IMMEDIATE NEXT (Lakuin minggu ini)

1. **Setup ANTHROPIC_API_KEY** + **SUPABASE_SERVICE_ROLE_KEY** + **CRON_SECRET** di .env + Vercel
2. **Test Course Studio** local: `npm run dev` → buka `/dashboard/studio`
3. **Migrate konten "AI untuk Pemula" dari draft lu** (kalau masih ada di docs/notion) lewat Bulk Import
4. **Pakai AI Generate** untuk modul yang konten draft-nya belum ada
5. **Deploy** ke Vercel — push to master, env vars sync
6. **Test cron** manual: 
   ```
   curl -H "Authorization: Bearer $CRON_SECRET" https://kaalupi.vercel.app/api/cron/re-engage
   curl -H "Authorization: Bearer $CRON_SECRET" https://kaalupi.vercel.app/api/cron/weekly-digest
   ```
7. **Setup n8n cloud** + connect 2 webhook → setup ke Email/WhatsApp output

---

## 📞 KALAU NEMU BUG / BUTUH FITUR BARU

Kasih kontekstnya jelas: **apa yang lu coba lakuin**, **apa yang terjadi**, **apa yang lu harapkan**. Gw langsung action ngga perlu nanya panjang.

Selamat bangun startup, bro 🚀
