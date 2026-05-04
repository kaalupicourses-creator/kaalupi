# Video Scripts: AI untuk Pemula

## Modul 0: Cara Kerja AI & LLM (45 menit)

### Opening (2 menit)
"Halo semuanya! Selamat datang di course 'AI untuk Pemula' oleh Kaalupi. Saya [Nama Founder], dan dalam 7.5 jam ke depan, kita akan transform dari orang yang nggak tahu apa-apa tentang AI, jadi bisa pakainya secara profesional untuk karir.

Hari ini kita mulai dari dasar: Apa itu AI sebenarnya?"

### Segment 1: Apa itu AI? (10 menit)
- Definisi sederhana: Mesin yang bisa melakukan tugas manusia
- Contoh nyata: Siri, Google Maps, Netflix recommendation
- Perbedaan Narrow AI vs General AI
- Demo: Tunjukin ChatGPT/Claude response yang "seolah-olah paham"

### Segment 2: Bagaimana LLM Bekerja? (15 menit)
- Konsep: Prediksi kata berikutnya (nggak hafal, cuma prediksi statistik)
- Analogi: Prediksi kata "Saya mau makan ___" -> "nasi" (bukan "mobil")
- Arsitektur Transformer (jangan terlalu teknis, highlight: attention mechanism)
- Parameter: GPT-4 punya 1.76 triliun parameter (bandingkan: otak manusia ~100 triliun koneksi)

### Segment 3: Claude vs ChatGPT vs Gemini (10 menit)
- Perbedaan utama: Training data, constitutional AI (Claude), browsing (ChatGPT Plus)
- Demo: Tanya pertanyaan yang sama ke 3 AI, bandingkan hasilnya
- Kapan pakai yang mana? (Claude untuk analisis dokumen, ChatGPT untuk kreatif, Gemini untuk Google Workspace)

### Segment 4: Etika & Limitation (5 menit)
- AI bisa halusinasi (nggak tahu = ngawur tapi yakin)
- Bias dalam training data
- Jangan share data sensitif (password, NIK, dll)
- AI adalah tools, bukan pengganti berpikir manusia

### Lab Intro (3 menit)
"Nah, sekarang waktunya praktik! Buka browser, buat akun di Claude.ai atau ChatGPT, dan coba prompt pertamamu. Saya tunggu di lab section!"

---

## Modul 1: Prompt Engineering Dasar sampai Lanjut (60 menit)

### Opening (3 menit)
"Modul lalu kita udah kenal AI. Sekarang kita belajar: Gimana caranya biar AI ngeluarin output yang kita mau? Ini namanya Prompt Engineering."

### Segment 1: Komponen Prompt yang Baik (15 menit)
- Context: "Saya adalah junior developer dengan 1 tahun pengalaman..."
- Instruction: "Jelaskan apa itu API dalam bahasa yang sederhana..."
- Input Data: "Berikut adalah kode Python: [paste kode]"
- Output Format: "Berikan jawaban dalam bentuk tabel..."
- Constraint: "Jangan gunakan istilah teknis, maksimal 3 paragraf"

### Segment 2: Teknik Dasar (15 menit)
- Zero-shot: Langsung tanya
- Few-shot: Kasih 2-3 contoh dulu
- Demo: Bandingin "Terjemahkan: Hello" vs "Terjemahkan: Hello→Halo, Good morning→Selamat pagi. Sekarang terjemahkan: Good night"

### Segment 3: Advanced Techniques (20 menit)
- Chain-of-Thought: "Tolong hitung step-by-step:..."
- Self-Consistency: "Berikan 3 solusi, lalu pilih yang terbaik..."
- Role Prompting: "Act as a senior architect..."
- Prompt Chaining: Pecah tugas kompleks jadi beberapa prompt

### Segment 4: Common Mistakes (5 menit)
- Prompt terlalu umum: "Jelasin coding" ❌ vs "Jelasin variable di JavaScript untuk pemula" ✅
- Tidak kasih konteks: Output bakal generic
- Nggak spesifik: "Bikin kode" vs "Bikin kode Python untuk hitung luas segitiga dengan function"

### Lab Intro (2 menit)
"Buka lab section, coba 3 variasi prompt tadi. Screenshot hasilnya, itu bakal jadi portofolio pertamamu!"

---

## Modul 2: AI untuk Produktivitas & Kerja (60 menit)

### Opening (3 menit)
"Tau nggak, rata-rata karyawan yang pakai AI hemat 2-3 jam per hari? Hari ini kita belajar gimana caranya."

### Segment 1: AI untuk Writing (15 menit)
- Draft email: "Buat draft email follow-up ke klien yang belum bayar invoice 30 hari..."
- Proofreading: "Cek tata bahasa: [paste teks]"
- Summarization: "Ringkas laporan 10 halaman ini jadi 3 poin utama..."
- Translation: "Translate ke Inggris yang natural: [teks]"

### Segment 2: AI untuk Data Analysis (15 menit)
- "Analisis data penjualan: [data]. Berikan 3 insight utama."
- "Buat visualisasi data (dalam teks): [data]"
- "Identifikasi tren dari data 12 bulan: [data]"

### Segment 3: AI untuk Meeting & Dokumentasi (12 menit)
- "Buat agenda meeting 1 jam untuk proyek peluncuran produk..."
- "Ringkas notulensi berikut jadi 5 action items: [notulensi]"
- "Buat follow-up email setelah meeting..."

### Segment 4: AI untuk Riset (10 menit)
- "Cari 5 tren teknologi 2026 di bidang IT..."
- "Bandingkan Asana vs Trello vs Monday untuk tim 10 orang..."

### Demo: Workflow Nyata (5 menit)
Tunjukin: Riset → Draft → Edit → Final dalam 15 menit (tanpa AI butuh 1 jam)

---

## Modul 3: AI untuk Bisnis & Karier (60 menit)

### Opening (3 menit)
"AI bukan cuma buat produktivitas pribadi. Perusahaan gede kayak Starbucks pakai AI buat naikin penjualan 3%. Hari ini kita pelajari gimana."

### Segment 1: Transformasi Bisnis (15 menit)
- Customer service: Chatbot 24/7 + human escalation
- Personalisasi: Rekomendasi produk berdasarkan riwayat belanja
- Content creation masal: 1000+ product description dalam menit
- Strategic decision: Market research + competitor analysis otomatis

### Segment 2: AI untuk Pengembangan Karier (20 menit)
- Skill gap analysis: "Saya frontend dev, target: Fullstack. Apa yang harus dipelajari?"
- Interview prep: "Simulasikan interview Data Scientist..."
- Resume optimization: "Optimasi CV saya untuk posisi PM: [paste CV]"
- Salary negotiation: "Saya dapet tawaran 15jt, pasar 18-22jt. Bantu negosiasi..."

### Segment 3: Use Cases per Profesi (15 menit)
- Untuk Programer: Code review, debugging, refactoring, documentation
- Untuk Marketing: Copywriting, content calendar, SEO
- Untuk HR: Job desc, screening CV, interview questions
- Untuk Freelancer: Proposal, time tracking, invoice

### Lab Intro (7 menit)
"Project akhir modul ini: Career pivot planning. Misalkan kalian mau pindah ke AI Engineer, buat roadmap 12 bulan lengkap dengan AI!"

---

## Modul 4: AI Tools Populer & Workflow Praktis (90 menit)

### Opening (5 menit)
"Di 2026 ini ada ratusan AI tools. Hari ini kita fokus ke yang paling berdampak + gimana bikin workflow end-to-end."

### Segment 1: LLM Chatbots Comparison (20 menit)
- ChatGPT: Plugins, browsing, DALL-E (image generation)
- Claude: 200k tokens context (bisa baca dokumen tebal), Constitutional AI
- Gemini: Integration Google Workspace (Gmail, Docs, Sheets)
- Demo: Upload PDF 50 halaman ke Claude, minta summary + insight

### Segment 2: AI untuk Coding (15 menit)
- GitHub Copilot: Autocomplete di IDE
- Cursor: AI-first code editor (fork VS Code)
- Replit Agent: Full-stack development dengan AI
- v0.dev: Generate UI components dari prompt
- Live demo: Bikin komponen React dengan v0.dev dalam 5 menit

### Segment 3: AI untuk Design (15 menit)
- Midjourney: Image generation berkualitas tinggi
- Canva Magic Studio: AI design untuk non-designer
- Figma AI: UI/UX design assistant
- Sora (OpenAI): Text-to-video generation
- Demo: Generate 5 featured images untuk blog dengan Midjourney

### Segment 4: AI untuk Productivity (15 menit)
- Notion AI: AI di workspace & note-taking
- Slack AI: Search & summarize threads
- Zoom AI Companion: Meeting summary otomatis
- Microsoft 365 Copilot: AI di seluruh suite Microsoft

### Segment 5: Building AI Workflow (20 menit)
Demo end-to-end:
1. Riset topik dengan ChatGPT
2. Buat outline artikel dengan Claude
3. Expand jadi artikel 1500 kata dengan ChatGPT
4. Edit dengan Grammarly GO
5. Generate featured image dengan Midjourney
6. SEO check dengan Semrush AI
7. Publish ke WordPress + auto-post ke social media

### Final Project Intro (5 menit)
"Modul terakhir! Kalian bakal bikin AI-powered portfolio. Gunakan semua yang udah dipelajari: planning dengan AI, content generation, coding dengan Copilot, sampai deployment dengan Vercel AI. Detailnya ada di final project section!"

---

## Tips Production Video:

1. **Talking Head**: Face camera, eye contact, semangat (nggak kaku kayak dosen)
2. **Screen Recording**: Pakai OBS Studio atau QuickTime (Mac), tunjukin step-by-step
3. **B-Roll**: Potongan gambar/tools buat memecah kebosanan
4. **Captions**: Wajib ada (80% orang nonton tanpa suara di HP)
5. **Call-to-Action**: Tiap akhir video ingetin buat buka lab section

## Tools yang Dibutuhkan:
- Kamera HP 1080p/Webcam HD
- Mic: Maono/Boya (~300-500rb) atau earphone bawaan (yang penting jernih)
- Lighting: Cari cahaya alami atau beli ring light murah
- Software edit: DaVinci Resolve (gratis) atau CapCut
- Screen record: OBS Studio (gratis)

## Format File:
- Resolusi: 1080p (1920x1080)
- Frame rate: 30fps
- Audio: 128kbps AAC
- Duration: Sesuai modul (45-90 menit)
- Format: MP4 (H.264)

## Upload ke:
1. YouTube (unlisted dulu) → ambil URL buat dimasukin ke `video_url` di materials
2. Atau Google Drive (shareable link) → lebih stabil buat Vercel deployment
