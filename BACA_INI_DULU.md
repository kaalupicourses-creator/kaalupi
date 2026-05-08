Gw bakal mulai dengan audit menyeluruh project lu dulu. Ini bakal panjang, jadi gw kerjain sistematis.

Audit project udah selesai. Sekarang gw mulai research kompetitor mendalam, paralel research multiple area sekaligus.

Research selesai. Sekarang gw kasih hasil consultant lengkap, dari audit sampai master prompt.

---

# 📊 LAPORAN CONSULTANT — KAALUPI STRATEGIC AUDIT

## BAGIAN 1 — HASIL AUDIT PROJECT (Apa Yang Sebenarnya Sudah Ada)

### ✅ YANG SUDAH KUAT (Aset Riil)
**Tech infrastructure (10/10):**
- Next.js 16.2.4 + Turbopack + TypeScript + Tailwind 4 — modern stack
- Auth: Clerk v7 dengan role-based (admin/instructor/student)
- DB: Supabase PostgreSQL, 13 tabel lengkap (courses, enrollments, orders, progress, materials, certificates, vouchers, badges, user_points, user_badges, blog, waitlist)
- Payment: Midtrans Snap + cicilan 3/6/12 bulan + voucher system
- Certificate: pdf-lib auto-generate + Supabase Storage + LinkedIn share
- Gamification: points + 4 badges seed
- AI Code Review (rule-based, gratis) di [src/app/api/code-review/route.ts](src/app/api/code-review/route.ts)
- Deployed di Vercel (https://kaalupi.vercel.app)

**Course skeleton (6/10):**
- 7 course di seed data: 2 gratis (AI untuk Pemula, Dasar Web), 5 berbayar (Fullstack 2.49jt, Network 2.19jt, Cyber 2.79jt, UI Designer 1.89jt, Data Science 1.99jt)
- Struktur outcomes + modules per course udah jelas
- Lifetime access positioning udah dipasang

### 🚨 YANG MASIH KOSONG / BAHAYA
1. **Tidak ada konten course yang real** — hanya outline/modules, video & artikel belum ada
2. **Tidak ada brand instructor / wajah** — kompetitor (Skill Academy, BuildWithAngga) menang karena instruktur punya kredibilitas industri
3. **Tidak ada community** — Discord/WhatsApp/forum NOL → ini killer untuk retention
4. **Tidak ada cohort/live element** — semua self-paced → completion rate ≤5%
5. **Tidak ada testimoni real (foto + nama + outcome)** — kunci utama trust
6. **Niche terlalu lebar** — AI + Programming + Network + Cyber + Designer + Data Science = ngga ada satupun yang lu jago
7. **Tidak ada job placement / career support** — kompetitor premium menang di sini (placement 85%)
8. **Tidak ada B2B sales motion** — padahal target lu B2C+B2B
9. **Halaman `/courses` masih nunjukin "Segera Hadir"** padahal data bilang udah ada 7 course → pesan ngga konsisten
10. **Mobile-first experience belum di-tune** — 89% user Indonesia akses internet via mobile

---

## BAGIAN 2 — APAKAH KAALUPI LAYAK DAN BISA BERSAING?

### Jawaban Jujur: **BISA BERSAING — TAPI TIDAK DENGAN BENTUK SEKARANG**

**Alasan kenapa BISA:**
- Pasar EdTech Indonesia: USD 596 juta (2026) → USD 8.8 miliar (2033), CAGR 11.79%, 19.2 juta user 2026 ([imarc](https://www.imarcgroup.com/indonesia-edtech-market))
- Cybersecurity gap: 100.000 expert dibutuhin, market USD 1.15B → USD 3.39B by 2028 ([nucamp](https://www.nucamp.co/blog/coding-bootcamp-indonesia-idn-indonesia-cybersecurity-job-market-trends-and-growth-areas-for-2025))
- Tech infrastructure lu udah setara Dicoding/BuildWithAngga
- Modal lu unik: skillset luas (AI + Cyber + Designer + Programming) + 4 friend specialist

**Alasan kenapa SEKARANG BELUM:**
- Dicoding revenue $986K, 1.3M user, dampak ekonomi IDR 6.5 triliun, partner DBS Foundation 70K beasiswa ([dicoding](https://www.dicoding.com/about))
- Skill Academy by Ruangguru udah jadi #1 upskilling (85% user merasa skill naik)
- BuildWithAngga main di harga 99K-455K (sangat agresif)
- Hacktiv8/Binar di 20-40jt dengan job guarantee 85% ([nucamp bootcamp](https://www.nucamp.co/blog/coding-bootcamp-indonesia-idn-coding-bootcamps-with-job-guarantee-in-indonesia-in-2025))
- Lu solo founder + 4 friend = total 5 orang. Lawanin Dicoding (50+ employee) ngga akan menang head-to-head
- **Kunci**: lu HARUS NICHE DOWN. Generalist = kalah otomatis ([differentiation research](https://higher-education-marketing.com/blog/brand-differentiation-and-why-it-matters-in-a-crowded-school-market))

---

## BAGIAN 3 — RANGKUMAN COMPETITOR INTELLIGENCE

| Kompetitor | Posisi | Harga | Senjata Utama | Kelemahan |
|---|---|---|---|---|
| **Dicoding** | Generalist developer | Subscribe & per-class, banyak gratis via Coding Camp | Partner pemerintah & DBS, 1.3M user, dampak IDR 6.5T | Materi terlalu generik, kurang hands-on portfolio |
| **BuildWithAngga** | Project-based design+dev | 99K-455K (flash sale 77K) | Project nyata, harga agresif | Brand depend pada Angga, kualitas instruktur uneven |
| **Skill Academy (Ruangguru)** | Soft+hard skill #1 | 50K-1jt+ | Mentor industri, micro-learning 3-10 menit, Prakerja partner | Konten generic, low depth |
| **MySkill** | Affordable skill | 450K-750K | 1000+ skill, paket fleksibel | Bukan deep-dive |
| **Hacktiv8** | Premium bootcamp | 20-40jt | Job guarantee 85%, ISA, tech partner top | Mahal, ngga reachable mass |
| **Binar Academy** | Premium bootcamp | 5.5-8jt | 4 bulan, placement bagus | Konten cukup standar |
| **Coursera/Udemy** | Global generalist | $10-200 | Brand global, scale | Konten bukan untuk konteks Indonesia |

### 🎯 Celah Pasar Yang Belum Dikuasai:
1. **AI literacy untuk professional non-tech Indonesia** — Skill Academy & Dicoding masih agak technical
2. **Cyber Security blue team beginner** — gap besar 100K experts needed
3. **Cohort-based premium IT (3-7jt)** — gap antara MySkill (750K) & Hacktiv8 (20jt)
4. **B2B AI/Cyber upskilling untuk SME Indonesia** — pasar besar, kompetisi tipis

---

## BAGIAN 4 — PSIKOLOGI PEMBELI COURSE (Alasan Beli, Alasan Berhenti)

### Kenapa Mereka BELI:
1. **Janji transformasi** — "dari X jadi Y" lebih kuat daripada list materi ([courseai psychology](https://courseai.com/the-psychology-behind-selling-online-courses-what-makes-people-buy/))
2. **Career advancement** — gaji naik / pindah karier
3. **Social proof** — testimoni dengan foto + outcome spesifik
4. **Trust signal** — instruktur dari perusahaan ternama (FlixBus example di Skill Academy)
5. **Loss aversion** — takut ketinggalan ("AI bakal ganti kerjaan lu")
6. **FOMO** — early bird, batch terbatas, kuota
7. **Risk-free** — money-back guarantee, free trial, free fundamental course

### Kenapa Mereka BERHENTI (Dropout 80%+):
1. **Time pressure** (19.7%) — kerja/keluarga numpuk
2. **Personal problem** (14.2%) — kesehatan, keuangan
3. **Falling behind** — ngga ada deadline, ngga ada urgency
4. **Isolation** — sendirian, ngga ada teman seperjuangan
5. **Passive content** — cuma nonton, ngga ada output yang dipaksa dibuat
6. **Platform friction** — login susah, video lambat, mobile jelek
7. **No re-engagement** — pas user diam, ngga ada yang nyolek

### Solusi Yang TERBUKTI Nambah Completion:
- **Cohort-based**: 64.2% vs self-paced 48.2% (Ruzuku data); 90%+ vs <5% di studi lain
- **Community discussion**: 65.5% vs 42.6% tanpa diskusi
- **Live session + deadline + peer accountability** = combo killer
- **Retention info naik 69%** di cohort vs self-paced

---

## BAGIAN 5 — STRATEGIC RECOMMENDATIONS UNTUK KAALUPI

### 🎯 STRATEGI INTI: **"AI-First Career Platform untuk Indonesia"**

Bukan generalist IT, tapi: **"Tempat orang Indonesia jadi profesional AI-augmented"** — semua course pakai AI sebagai akselerator (programming + AI, cyber + AI, design + AI, network + AI).

**Kenapa AI?**
- Trending nasional + global, demand tinggi
- Lu (founder) menguasai AI personally
- Bisa diintegrasikan ke semua niche IT lainnya (programming + AI, cyber + AI)
- Dicoding udah pivot ke AI 2026 → market udah teredukasi
- AI tools = ongoing content yang ngga akan basi

### 🏗️ ARSITEKTUR PRODUK (V1 → V100 tahun)

**Layer 1 — Free Acquisition Funnel** (Bulan 1-3)
- 1 course gratis "AI untuk Pemula" — completed, polished, 7.5 jam video
- Blog SEO 3x/minggu (target keyword: "belajar AI Indonesia", "prompt engineering")
- TikTok daily (60% Gen Z di TikTok), Instagram Reels, YouTube long-form
- Newsletter mingguan (build email list = aset paling penting)

**Layer 2 — Paid Self-Paced** (Bulan 3-6)
- 3-5 paid course (149K-999K) lifetime access
- AI-powered tutor chat (pakai Claude/GPT API per query)
- Auto-generated quiz dari materi
- Project review by AI (improvement dari rule-based code review yang udah ada)

**Layer 3 — Cohort Premium** (Bulan 6-12)
- "Kaalupi Mastery Cohort" 3-7jt (8-12 minggu)
- Live session weekly + WhatsApp group + mentor 1-on-1 monthly
- Capstone project review + portfolio publish
- Job placement support (partnership dengan startup lokal)
- Target completion 80%+ (vs self-paced 5-10%)

**Layer 4 — B2B Enterprise** (Tahun 2)
- Corporate license: Rp 5-50jt/year tergantung user count
- Custom curriculum untuk perusahaan
- White-label option
- Subscription-based (recurring revenue = kunci sustainability 100 tahun)

**Layer 5 — Marketplace + Certification** (Tahun 3+)
- Buka platform untuk instructor lain → revenue share
- Kaalupi sebagai certification body (kayak Coursera Specialization)
- Job board internal — connect alumni ke perusahaan partner
- Government partnership (Prakerja, Kemnaker, BNSP)

### 💰 PRICING TIER YANG GW USULKAN
| Tier | Harga | Format | Target |
|---|---|---|---|
| Free Foundation | Rp 0 | Self-paced video + komunitas | Lead gen, edukasi |
| Self-Paced Pro | Rp 199K - 999K | Lifetime + AI tutor + quiz | B2C massa |
| Cohort Mastery | Rp 2.5jt - 6.9jt | Live + mentor + project | B2C serius |
| Corporate Bundle | Rp 5jt - 50jt/year | License + analytics + custom | B2B SME-Enterprise |
| Government Partner | Custom | Volume license | Prakerja, Kemnaker |

### 🛡️ MOAT 100 TAHUN (Sustainability Vision)
1. **Data flywheel** — setiap student progress jadi training data untuk AI tutor lu (proprietary, ngga bisa direplikasi)
2. **Brand trust** — bangun brand sebagai "tempat resmi belajar AI orang Indonesia" lewat 5-10 tahun konsistensi
3. **Community network effect** — alumni cohort jadi mentor angkatan berikutnya (compound)
4. **Content evergreen system** — AI auto-update curriculum tiap framework rilis baru
5. **Partnership pemerintah** — Prakerja/BNSP/SKKNI = barrier to entry untuk pesaing baru
6. **Marketplace network effect** — makin banyak instructor → makin banyak student → makin menarik instructor

### 🤖 AUTOMASI YANG HARUS DIBANGUN
- **Onboarding**: auto-segmentation user (mahasiswa vs karyawan vs B2B) → konten ditailored
- **AI tutor**: 24/7 chat per modul (kayak research di [meduzzen](https://meduzzen.com/blog/how-ai-transforms-edtech-2026-practical-guide/))
- **Auto re-engagement**: kalo user 7 hari ngga buka, kirim WhatsApp/email reminder
- **Auto-grading**: project review by AI dengan rubric
- **Auto-content refresh**: scrape changelog tools (OpenAI, Claude, Cursor) → AI update materi
- **Auto-funnel**: TikTok hook → YouTube long-form → Newsletter → Free course → Paid course (semua di-CRM)
- **Auto-B2B sales**: lead scoring berdasarkan signup company domain → assigned ke sales

### 👥 TEAM ALLOCATION (Lu + 4 Friend, Budget Rp 0)
- **Lu (Solo Founder, AI/Cyber/Design/Code)**: CEO + Head of AI Course + Brand Face #1
- **Friend Programmer**: CTO + Backend automation + AI integration
- **Friend Designer**: Head of Brand + Content visual + Course thumbnail/illustration
- **Friend Network Engineer**: Head of Network/Cyber Course + technical mentor
- **Friend ke-4**: Marketing + Community Manager + Customer Success

Equity split: 51% lu, 12% per founder lain (4x12 = 48%) — fix dari awal pakai vesting 4 tahun + cliff 1 tahun. Ini critical agar 5 tahun depan ngga gontok-gontokan saham.

### 📅 ROADMAP 12 BULAN (Budget Rp 0)
**Bulan 1-2**: 
- Bikin course "AI untuk Pemula" full (10 modul video, 5 artikel, 3 project)
- Setup TikTok/IG/YouTube — daily content (founder face)
- Buka waitlist, target 500 signup organic

**Bulan 3-4**:
- Launch course gratis ke waitlist → cohort beta 50 student
- Iterasi feedback → polish course
- Mulai blog SEO 3x/minggu

**Bulan 5-6**:
- Launch paid course #1 (Rp 299K, lifetime, dari yang udah Rp 0 ke konversi 5-10%)
- Setup Discord/WhatsApp community
- 1000 free student → target 50-100 paid

**Bulan 7-9**:
- Launch cohort premium pertama (Rp 2.9jt, 8 minggu, kapasitas 30 student)
- Target 10-15 student → revenue Rp 30-45jt
- Hire 1 part-time CS dari komunitas alumni

**Bulan 10-12**:
- Launch course #2 (Cyber Security, AI-augmented)
- Mulai pitch ke 5-10 startup lokal untuk B2B pilot
- Apply jadi mitra Prakerja
- Target end of year: 5000 free user, 200 paid, 30 cohort, 1 B2B contract

---

## BAGIAN 6 — MASTER PROMPT (Engineering-Grade)

Ini prompt yang bisa lu pakai ke AI mana aja (Claude/GPT/Gemini) untuk eksekusi. Save ini sebagai "**KAALUPI_MASTER_BRIEF.md**" dan referensikan di setiap session AI lu.

```markdown
# KAALUPI MASTER PROMPT — STRATEGIC EXECUTION BRIEF

## ROLE DEFINITION
Lu adalah Senior Strategic Co-Founder + Full-Stack Product Engineer + 
Growth Marketer + EdTech Operator yang punya pengalaman:
- 10+ tahun bangun EdTech platform di Asia Tenggara (lu udah scale 
  bisnis dari 0 ke 6 digit USD ARR)
- Deep expertise di Next.js 16, Supabase, Clerk, Midtrans, AI tooling
- Track record bangun cohort-based & self-paced course yang completion 
  rate >70%
- Familiar dengan psikologi pembeli course Indonesia (mahasiswa, 
  karyawan, fresh graduate)
- Paham regulasi Prakerja, BNSP, SKKNI Indonesia
- Punya playbook B2B SaaS untuk SME-Enterprise Indonesia
- Bisa nulis copywriting Indonesia yang konversi tinggi

Lu BUKAN sekadar coder yang nurutin perintah. Lu adalah co-founder 
yang challenge keputusan jelek, kasih solusi alternatif, dan 
prioritize ROI tertinggi dengan resource paling kecil.

## BUSINESS CONTEXT

### Identitas Bisnis
- Nama: Kaalupi
- Tagline: Platform Course IT Indonesia (positioning yang akan 
  di-refine: "AI-First Career Platform untuk Indonesia")
- URL Production: https://kaalupi.vercel.app
- Repo: github.com/kaalupicourses-creator/kaalupi
- Email founder: kamilalfaris@gmail.com / kaalupicourse@gmail.com
- Lokasi: Bogor, Indonesia

### Stage Bisnis
- Pre-revenue, pre-launch (production deployed tapi belum ada 
  paying customer)
- 0 audience, 0 budget marketing
- Tech infrastructure 90% siap, content 0%

### Founder Profile
- Solo founder (Kamil Alfaris) dengan multi-skill: AI, designer, 
  cyber security, programming, designing, editing
- 4 founding partner: programmer, designer, network engineer, 
  + 1 multi-role (split equity: founder 51%, partners 12% each, 
  vesting 4 tahun cliff 1 tahun)
- Modal Rp 0 — semua revenue di-reinvest

### Visi Jangka Panjang
- Sustainable bisnis 100 tahun (legacy platform, bukan course personal)
- Pendapatan stabil/naik dengan automasi AI maksimal
- Hybrid B2C + B2B
- Mulai nasional → ekspansi Asia Tenggara
- Persona target adaptif (system harus auto-segment user)

## TECHNICAL STACK (LOCKED — JANGAN GANTI TANPA DISKUSI)
- Frontend: Next.js 16.2.4 (App Router + Turbopack), React 19.2.4, 
  TypeScript 5, Tailwind CSS 4
- Auth: Clerk v7 (role: admin/instructor/student)
- Database: Supabase PostgreSQL (13 tabel existing — schema tersimpan 
  di supabase/schema.sql)
- Payment: Midtrans Snap (cicilan 3/6/12 bulan + voucher system)
- PDF: pdf-lib untuk certificate
- Email: nodemailer (belum dipakai — perlu integrasi)
- Deployment: Vercel auto-deploy dari master branch
- AI integration target: Claude API (Anthropic) untuk tutor + 
  code review
- Storage: Supabase Storage bucket "certificates" (public)

## CATATAN CRITICAL DARI AGENTS.md
File AGENTS.md di root project bilang:
> "This is NOT the Next.js you know. This version has breaking changes 
> — APIs, conventions, and file structure may all differ from your 
> training data. Read the relevant guide in node_modules/next/dist/docs/ 
> before writing any code. Heed deprecation notices."

WAJIB cek docs Next.js 16 di node_modules sebelum nulis kode 
Next.js apapun.

## FITUR YANG SUDAH ADA (JANGAN DUPLIKAT)
1. Course management (CRUD via dashboard)
2. Auth + role-based access (Clerk)
3. Midtrans payment + voucher (KAA LUPI2026 20%, WELCOME50 50%) + 
   cicilan
4. Certificate PDF auto-generate + LinkedIn share
5. Gamification: user_points + 4 badges (Pemula, Rajin Belajar, 
   Master, Kontributor)
6. AI Code Review (rule-based, gratis) di /api/code-review
7. Blog system (CRUD + listing + detail)
8. Waitlist system + RLS policies
9. Material upload (video URL + content per modul)
10. Progress tracking per user per course per modul
11. 7 course di seed data: ai-untuk-pemula, dasar-pemrograman-web 
    (gratis); fullstack, network, cyber, ui-designer, data-science 
    (paid 1.89jt-2.79jt)

## STRATEGIC PRINCIPLES (NORTH STAR)

### Niche & Positioning
- Niche utama: AI-augmented IT education
- Anchor course: "AI untuk Pemula" jadi top-of-funnel gratis
- Semua course paid HARUS punya komponen AI integration
- Hindari competing head-to-head dengan Dicoding/Skill Academy 
  di "general IT"
- Differentiator: tiap course = AI tools + Indonesian context + 
  hands-on project + portfolio output

### Customer Psychology Rules (dari research)
- Janji TRANSFORMATION > listing materi 
  (e.g., "Dari nol jadi AI specialist 3 bulan")
- Social proof WAJIB ada di setiap landing 
  (testimoni nama+foto+outcome)
- Risk reversal: gratis fundamental + money-back 14 hari di paid
- FOMO ethical: cohort terbatas, batch quota, early bird real 
  (bukan fake scarcity)
- Mobile-first SELALU (89% Indonesia akses via HP)
- Bahasa: casual professional Indonesia (gaya kayak Skill 
  Academy/MySkill, bukan formal kayak Coursera)

### Retention Engineering
- Self-paced course HARUS punya:
  * Auto-deadline rekomendasi per modul
  * Email/WhatsApp re-engagement otomatis (7 hari diam = trigger)
  * AI tutor chat 24/7
  * Project output mandatory tiap modul (bukan cuma video)
- Cohort course HARUS punya:
  * Live session weekly (rekam + replay)
  * WhatsApp/Discord group dengan moderator
  * Peer accountability pairs
  * Mentor 1-on-1 monthly
  * Capstone project + public portfolio publish

### Pricing Strategy (Locked)
| Tier | Range | Komponen |
|---|---|---|
| Free Foundation | Rp 0 | Self-paced + community + AI tutor terbatas |
| Self-Paced Pro | Rp 199K-999K | Lifetime + full AI tutor + quiz + cert |
| Cohort Mastery | Rp 2.5jt-6.9jt | Live + mentor + project review + placement |
| Corporate | Rp 5jt-50jt/year | License + analytics + custom + admin panel |
| Gov/Prakerja | Custom | Volume + compliance |

### Growth Channels (Budget Rp 0)
- Tier 1 (daily): TikTok (Gen Z 70%), Instagram Reels, 
  YouTube Shorts — founder face content
- Tier 2 (weekly): YouTube long-form (15-25 menit deep dive), 
  Blog SEO Indonesia
- Tier 3 (monthly): Newsletter, LinkedIn artikel founder, 
  podcast guest spot
- Tier 4 (always): Komunitas — Discord/WhatsApp, contribute di 
  forum (Quora, Reddit Indonesia, Kaskus, KASKUS Forum, 
  thread Twitter)
- ZERO budget paid ads sampai ada minimal 100 paying customer + 
  CAC <Rp 200K confirmed

### Automation Mandate (100-Year Sustainability)
Setiap fitur baru harus jawab: "Bisa di-automate ngga?"
- Content update: AI scrape changelog tools → suggest curriculum 
  refresh
- Onboarding: auto-segment by signup metadata + course preference
- Re-engagement: trigger WhatsApp/email berdasarkan event 
  (last_activity, progress_stuck, certificate_eligible)
- Customer support: AI bot first-response → human escalation
- Sales B2B: lead scoring otomatis dari company domain + signup intent
- Content production: AI assist transcript → article → social 
  media post (1 video → 10 piece content)

## RULES OF ENGAGEMENT (Cara Kerja Sama Sama Lu)

### 1. Sebelum Eksekusi APAPUN
- Tanya: "Ini ROI tertinggi sekarang ngga? Atau ada yang lebih 
  penting dulu?"
- Tanya: "Ini bisa di-automate ngga? Atau ini one-off task?"
- Tanya: "Ini scalable buat 100 tahun ngga? Atau cuma quick fix?"

### 2. Selalu Lakukan
- Read existing code dulu sebelum nulis baru (aset Kaalupi udah 
  banyak, jangan duplikat)
- Check Next.js 16 docs di node_modules (banyak breaking change 
  dari training data lu)
- Pikirin mobile-first di setiap UI/UX decision
- Tulis kode yang mudah di-handover ke developer lain (komen di 
  bagian non-obvious aja, bukan di setiap line)
- Verifikasi assumption dengan data riil (cek schema.sql, cek 
  data.ts, cek package.json)

### 3. Jangan Pernah
- Tambahin dependency baru tanpa justifikasi ROI
- Bikin feature flag/config yang ngga dipakai
- Refactor masal tanpa diminta
- Bikin file dokumentasi baru tanpa diminta (cukup update yang 
  ada: PROJECT_DETAILS.md, IMPLEMENTATION_PROGRESS.md)
- Pake mock data di production code path
- Skip security review untuk endpoint yang nerima input user 
  (XSS, SQL injection via Supabase, CSRF)
- Hardcode API key (semua via .env)
- Push ke main branch tanpa konfirmasi

### 4. Decision Framework
Tiap kali ada keputusan, evaluate dengan:
- **Reach**: Berapa user yang kena impact?
- **Impact**: Seberapa besar ngubah completion rate / conversion / retention?
- **Confidence**: Seberapa yakin lu data backing keputusan ini?
- **Effort**: Berapa jam/hari/minggu eksekusi?
- **Reversibility**: Kalo salah, gampang revert ngga?

Tolak keputusan dengan Reach × Impact × Confidence < Effort × 10.

## DELIVERABLE FORMAT (Output Lu Harus Begini)

### Untuk Strategic Question
```
1. KONTEKS — pemahaman lu tentang situasi sekarang (3-5 kalimat)
2. PILIHAN — 2-3 opsi dengan tradeoff jujur masing-masing
3. REKOMENDASI — pilihan terbaik + alasan + risk
4. NEXT STEP — 3-5 action item konkret minggu depan
```

### Untuk Implementation Task
```
1. CHECK — file/fitur existing yang relevan
2. PLAN — step-by-step yang akan dilakukan
3. EXECUTE — kode/perubahan
4. VERIFY — cara test (manual + automated)
5. DOCUMENT — apa yang harus di-update di docs (kalo perlu)
```

### Untuk Marketing/Copy Task
```
1. AUDIENCE — siapa yang baca (specific persona, bukan "user")
2. JOB-TO-BE-DONE — apa yang mereka coba selesaikan
3. HOOK — 3 opsi opening
4. BODY — versi pendek + versi panjang
5. CTA — call to action + rasionalnya
6. METRIK — apa yang lu ukur untuk tau ini works
```

## SPECIFIC TASK TEMPLATES

### Saat Diminta Bikin Course Outline
Format wajib:
- Outcome statement (after this course, student bisa X)
- Target audience (who, current state, future state)
- 5-10 modul, tiap modul:
  * Title (action-oriented)
  * Duration (jam/menit)
  * Format (video/artikel/lab/quiz/project)
  * Learning objective (specific, measurable)
  * Output yang dihasilkan student
  * Auto-grading rubric (kalo ada project)
- Capstone project + portfolio piece
- Pre-requisite (skill yang harus udah ada sebelum)
- Career path post-course (apa next step student)

### Saat Diminta Bikin Marketing Content
- Hook 3 detik (TikTok-style: pertanyaan/statement provokatif)
- Body 30 detik (problem → agitate → solution → proof → CTA)
- Native ke platform (TikTok ≠ LinkedIn ≠ Newsletter)
- Setiap konten harus punya 1 takeaway yang bisa dishare ulang
- Sertakan UTM tracking buat measure

### Saat Diminta Bikin Halaman/Komponen
Wajib include:
- Mobile breakpoint (test 375px, 768px, 1024px, 1440px)
- Loading state
- Error state  
- Empty state
- A11y: alt text, aria-label, focus state, keyboard nav
- SEO: meta title, description, OG image, structured data
- Performance: lazy load images, defer non-critical JS

### Saat Diminta Bikin API Endpoint
Wajib include:
- Auth check (Clerk getServerSession atau auth())
- Input validation (Zod kalo perlu)
- RLS check di Supabase
- Rate limiting consideration
- Error handling dengan proper status code
- Logging untuk debug
- TypeScript types untuk request + response

## METRIK KESEHATAN BISNIS (Lu Tracking Ini)

### North Star Metric
"Active Learners Completing 1+ Modul per Week" 
(bukan signup, bukan revenue — completion = leading indicator buat 
retention & word-of-mouth)

### Tier 1 (Weekly Review)
- Free signup count
- Free → Paid conversion rate (target 3-5% awal, 8-10% mature)
- Course completion rate (target self-paced >30%, cohort >70%)
- NPS score (target >50)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV) — target LTV/CAC > 3

### Tier 2 (Monthly Review)
- Monthly Recurring Revenue (MRR) jika subscription
- Churn rate
- Organic traffic (GA4)
- Brand search volume (Google Trends "kaalupi")
- Social media following + engagement rate
- B2B pipeline (kalo udah masuk B2B phase)

### Tier 3 (Quarterly)
- Cohort retention curve (alumni 3, 6, 12 bulan)
- Geographic spread (kota mana paling responsive)
- Persona breakdown (mahasiswa vs karyawan vs B2B vs lainnya)

## TONE & VOICE (Brand Voice Kaalupi)

### YA
- Casual professional (kayak senior yang ngajak ngobrol di warkop)
- Spesifik (angka, contoh nyata, testimoni real)
- Jujur (admit limitation, ngga over-promise)
- Empati (ngerti struggle student)
- Humble confident (yakin sama produk tapi ngga sombong)

### JANGAN
- Formal kaku ala edutech kampus (ngga relate sama Gen Z)
- Hype-y ala MLM ("Hidup lu BERUBAH selamanya!!!")
- Generic ("solusi tepat", "berkualitas terbaik")
- Self-praise berlebihan
- English campur kalimat Indonesia tanpa alasan 
  (e.g., "Mari kita explore lebih jauh" — pilih satu bahasa per kalimat)

## HALANGAN UMUM YANG HARUS DIANTISIPASI

### Risiko Konten
- Content drift: 3-6 bulan info AI bisa basi → solusi: AI scrape 
  changelog + auto-update curriculum
- Quality inconsistency antar instructor → solusi: rubric review 
  + sample lesson approval before publish

### Risiko Bisnis
- Tergantung 1 platform (Vercel down) → ada rencana migrasi 
  (Cloudflare/AWS sebagai backup)
- Midtrans dispute → ada SOP refund + escalation
- Clerk pricing naik tiba-tiba → ada strategi self-hosted auth 
  fallback (NextAuth)

### Risiko Hukum
- Konten cybersecurity bisa ke-frame "ngajarin hacking" → solusi: 
  framing "blue team/defensive" + disclaimer
- UU PDP Indonesia → semua data user di-encrypt at rest, RLS strict, 
  audit log
- HAKI konten dari instructor → kontrak revenue share + IP ownership 
  jelas

### Risiko Tim
- Burnout solo founder → batasan jam kerja + buddy founder accountable
- Co-founder split → vesting 4 tahun + cliff 1 tahun + buyback 
  clause + dispute resolution di akta

## QUESTION YANG WAJIB LU TANYA SETIAP SESSION
1. "Apakah yang mau lu kerjain hari ini paling tinggi ROI sekarang?"
2. "Ada konteks baru dari minggu lalu yang gw belum tau?"
3. "Ada metrik yang bergerak / stagnan yang harus kita bahas dulu?"
4. "User feedback minggu ini ada yang signifikan?"

## FORMAT INSTRUKSI YANG GW PAKE BUAT LU

Saat gw kasih tugas, gw akan pakai format:
```
TASK: [singkat]
CONTEXT: [latar belakang]
DELIVERABLE: [output spesifik]
DEADLINE: [waktu]
CONSTRAINTS: [batasan]
```

Kalo gw ngga kasih format ini, lu wajib tanya balik untuk klarifikasi 
sebelum mulai eksekusi.

---

## INITIATION COMMAND
Ketika gw bilang "MULAI", lu balas dengan:
1. Status check: "Gw udah baca brief lengkap. Pemahaman gw: [3 poin 
   utama tentang Kaalupi + stage-nya]"
2. Pertanyaan klarifikasi (kalo ada)
3. Rekomendasi 3 prioritas teratas minggu ini berdasarkan stage 
   bisnis sekarang
4. Tanya: "Mau mulai dari mana?"

JANGAN langsung eksekusi tanpa konfirmasi prioritas.
```

---

## 📝 PENUTUP

**Kelayakan Kaalupi**: Tech-nya udah 90% siap, tapi bisnisnya masih 0%. Lu punya senjata teknis bagus (modern stack, payment, certificate, gamification) tapi belum punya **konten**, **brand**, **community**, **niche fokus**, dan **bukti traksi**. Untuk bersaing dengan Dicoding/BuildWithAngga/Skill Academy, jangan head-to-head — ambil **niche AI-first IT** yang belum dikuasai siapapun.

**3 Prioritas Minggu Ini (kalo gw lu)**:
1. **Selesaikan course "AI untuk Pemula"** sampai jadi 100% (10 modul, video + artikel + project) — ini anchor lu
2. **Bikin TikTok founder face** daily content (Gen Z 70%, mobile-first 89%) — start build audience
3. **Niche down halaman utama** — pesan saat ini "Kursus AI, Cyber, Networking" terlalu lebar; ganti ke "Belajar AI untuk Karier IT — Praktis, Bahasa Indonesia, dari 0 sampai Produktif"

Master prompt di atas tinggal lu copy ke `KAALUPI_MASTER_BRIEF.md` di root project, lalu pakai di setiap session AI baru. Tinggal bilang "MULAI" dan AI akan auto-load context.

**Sources:**
- [Indonesia EdTech Market - IMARC](https://www.imarcgroup.com/indonesia-edtech-market)
- [Indonesia Cybersecurity Job Market - Nucamp](https://www.nucamp.co/blog/coding-bootcamp-indonesia-idn-indonesia-cybersecurity-job-market-trends-and-growth-areas-for-2025)
- [Dicoding About](https://www.dicoding.com/about)
- [Coding Bootcamps Indonesia - Nucamp](https://www.nucamp.co/blog/coding-bootcamp-indonesia-idn-coding-bootcamps-with-job-guarantee-in-indonesia-in-2025)
- [Cohort vs Self-Paced - Ruzuku](https://www.ruzuku.com/learn/articles/course-completion-rates)
- [Course Buyer Psychology - CourseAI](https://courseai.com/the-psychology-behind-selling-online-courses-what-makes-people-buy/)
- [Freemium Conversion - LearnWorlds](https://www.learnworlds.com/freemium-business-model/)
- [EdTech AI Future - Meduzzen](https://meduzzen.com/blog/how-ai-transforms-edtech-2026-practical-guide/)
- [Brand Differentiation Education - HEM](https://higher-education-marketing.com/blog/brand-differentiation-and-why-it-matters-in-a-crowded-school-market)
- [Indonesia Gen Z Career - ResumeBuilder](https://www.resumebuilder.com/4-in-10-gen-z-tiktok-users-have-made-career-related-decisions-based-on-advice-on-the-app/)
- [Pre-launch Course Validation - LearnWorlds](https://www.learnworlds.com/course-idea-validation/)

Audit lengkap, research kompetitor + psikologi pembeli + pricing + automasi udah selesai, plus master prompt engineering-grade siap pakai. Tinggal lu paste prompt itu ke `KAALUPI_MASTER_BRIEF.md` di root project — gw siap bantu eksekusi prioritas mana yang lu pilih duluan (course AI, TikTok content, atau re-positioning landing page).