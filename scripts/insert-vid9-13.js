const { createClient } = require("../node_modules/@supabase/supabase-js");
const supabase = createClient(
  "https://lpzjaorzhxqespuojsjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwemphb3J6aHhxZXNwdW9qc2pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg1OTMwMiwiZXhwIjoyMDkzNDM1MzAyfQ.JstoOavT0dmEIErayl6p-I8BhymJbJCZ2_ShNFl2_qE"
);

const codeBlock = (code, color = "#A8FF78") =>
  `<pre style="background:#1E1E1E;color:${color};padding:0.75rem 1rem;border-radius:8px;font-size:0.85rem;overflow-x:auto;margin:0.4rem 0 0.75rem;">${code}</pre>`;

const card = (content) =>
  `<div style="border:1px solid #F0E8D8;border-radius:12px;padding:1.2rem;margin:0.75rem 0;">${content}</div>`;

const note = (content, color = "#F0F7E8", border = "#7AB648") =>
  `<div style="background:${color};border-left:4px solid ${border};padding:0.7rem 0.9rem;border-radius:0 8px 8px 0;margin:0.75rem 0;"><p style="margin:0;font-size:0.85rem;">${content}</p></div>`;

const TARGET_BOX = (url, desc) => `
<div style="background:#1E1E1E;border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.5rem;">
  <p style="margin:0 0 0.3rem;font-size:0.8rem;color:#888;">🎯 TARGET / PLATFORM LATIHAN</p>
  <p style="margin:0;font-size:0.95rem;font-weight:800;color:#A8FF78;font-family:monospace;">${url}</p>
  <p style="margin:0.3rem 0 0;font-size:0.78rem;color:#666;">${desc}</p>
</div>`;

// ─────────────────────────────────────────────────────────────────────────────
const articles = [

// ── VID 9: CVE & CVSS ─────────────────────────────────────────────────────
{
  title: "🔎 Vulnerability Analysis — Cara Baca CVE & CVSS Score",
  module_index: 3,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🔎 Vulnerability Analysis — Cara Baca CVE & CVSS Score</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 9. Skill ini dipakai setiap hari oleh security analyst, pentester, dan SOC analyst di seluruh dunia.</p>
${TARGET_BOX("nvd.nist.gov + exploit-db.com", "National Vulnerability Database (US Gov) + Exploit Database — keduanya gratis dan bisa langsung diakses dari browser.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Apa itu CVE?</h3>
<p style="font-size:0.9rem;">CVE — <em>Common Vulnerabilities and Exposures</em> — adalah sistem penamaan standar global untuk setiap vulnerability yang ditemukan dan diverifikasi. Format: <code style="background:#F0E8D8;padding:0.15rem 0.4rem;border-radius:4px;">CVE-TAHUN-NOMOR</code></p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Contoh CVE Terkenal</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">CVE</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Nama</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">CVSS</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Dampak</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;font-size:0.8rem;">CVE-2021-44228</td><td style="padding:0.4rem 0.7rem;font-weight:700;">Log4Shell</td><td style="padding:0.4rem 0.7rem;font-weight:800;color:#E53935;">10.0</td><td style="padding:0.4rem 0.7rem;">RCE di library Java Log4j — dampak global</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;font-size:0.8rem;">CVE-2021-41773</td><td style="padding:0.4rem 0.7rem;font-weight:700;">Apache Path Traversal</td><td style="padding:0.4rem 0.7rem;font-weight:800;color:#E53935;">9.8</td><td style="padding:0.4rem 0.7rem;">RCE di Apache 2.4.49</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;font-size:0.8rem;">CVE-2017-5638</td><td style="padding:0.4rem 0.7rem;font-weight:700;">Equifax Breach</td><td style="padding:0.4rem 0.7rem;font-weight:800;color:#E53935;">10.0</td><td style="padding:0.4rem 0.7rem;">Apache Struts — 147 juta data bocor</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;font-size:0.8rem;">CVE-2014-0160</td><td style="padding:0.4rem 0.7rem;font-weight:700;">Heartbleed</td><td style="padding:0.4rem 0.7rem;font-weight:800;color:#F57C00;">7.5</td><td style="padding:0.4rem 0.7rem;">Bocorkan memory server OpenSSL</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">📊 Cara Baca CVSS Score</h3>
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Skala CVSS 0.0 — 10.0</p>
<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Score</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Kategori</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Tindakan</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">0.0</td><td style="padding:0.5rem 0.8rem;">None</td><td style="padding:0.5rem 0.8rem;">Tidak ada dampak signifikan</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">0.1–3.9</td><td style="padding:0.5rem 0.8rem;">Low</td><td style="padding:0.5rem 0.8rem;">Jadwalkan patch rutin</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">4.0–6.9</td><td style="padding:0.5rem 0.8rem;font-weight:700;">Medium</td><td style="padding:0.5rem 0.8rem;">Prioritaskan dalam sprint berikutnya</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FFF3D6;"><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E65100;">7.0–8.9</td><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E65100;">High</td><td style="padding:0.5rem 0.8rem;">Patch dalam 24–72 jam</td></tr>
<tr style="background:#FFF5F5;"><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E53935;">9.0–10.0</td><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E53935;">Critical</td><td style="padding:0.5rem 0.8rem;">Patch SEKARANG — atau isolasi sistem</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Komponen CVSS — Apa yang Menentukan Score?</h3>
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Attack Vector (AV)</p>
<p style="margin:0;font-size:0.87rem;"><strong>Network (N)</strong> → bisa diserang dari internet = score lebih tinggi<br/><strong>Adjacent (A)</strong> → butuh akses jaringan yang sama<br/><strong>Local (L)</strong> → butuh akses lokal ke mesin<br/><strong>Physical (P)</strong> → butuh akses fisik = score lebih rendah</p>`)}
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Faktor-faktor kunci lainnya</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Faktor</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Nilai Berbahaya</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Artinya</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;">Attack Complexity</td><td style="padding:0.4rem 0.7rem;font-weight:700;color:#E53935;">Low</td><td style="padding:0.4rem 0.7rem;">Mudah dieksploitasi</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;">Privileges Required</td><td style="padding:0.4rem 0.7rem;font-weight:700;color:#E53935;">None</td><td style="padding:0.4rem 0.7rem;">Tidak perlu login</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;">User Interaction</td><td style="padding:0.4rem 0.7rem;font-weight:700;color:#E53935;">None</td><td style="padding:0.4rem 0.7rem;">Korban tidak perlu klik apapun</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;">CIA Impact</td><td style="padding:0.4rem 0.7rem;font-weight:700;color:#E53935;">High/High/High</td><td style="padding:0.4rem 0.7rem;">Semua aspek sistem terpengaruh</td></tr>
</tbody></table>
${note("Log4Shell (CVE-2021-44228) dapat nilai Network, Low, None, None, High/High/High — semua faktor terburuk. Itulah kenapa skornya 10.0.", "#FFF5F5", "#E53935")}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🗂️ Workflow: Dari Hasil Nmap ke CVE</h3>
<ol style="font-size:0.9rem;margin:0 0 0 1.2rem;">
<li style="margin-bottom:0.5rem;">Buka hasil scan Nmap — catat service dan versinya. Contoh: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">Apache httpd 2.4.49</code></li>
<li style="margin-bottom:0.5rem;">Search di NVD: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">site:nvd.nist.gov Apache 2.4.49</code></li>
<li style="margin-bottom:0.5rem;">Catat CVE yang relevan dan CVSS score-nya</li>
<li style="margin-bottom:0.5rem;">Cek di Exploit-DB apakah sudah ada exploit publik</li>
<li>Dokumentasikan di laporan dengan severity level</li>
</ol>
${note("⭐ <strong>Tips Pro:</strong> Kalau CVSS ≥ 9.0 DAN ada exploit publik di Exploit-DB → ini priority satu dalam laporan pentest. Klien harus patch hari itu juga.", "#FFF3D6", "#F5A62A")}
${note("🎯 <strong>Next step:</strong> Di video berikutnya kita masuk ke Web Security — OWASP Top 10 dan kenapa setiap web developer wajib hafal daftar ini.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 10: OWASP Top 10 ──────────────────────────────────────────────────
{
  title: "🌐 Web Security Intro & OWASP Top 10 Overview",
  module_index: 4,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🌐 Web Security Intro & OWASP Top 10 Overview</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 10. OWASP Top 10 adalah referensi wajib setiap web developer, security engineer, dan pentester.</p>
${TARGET_BOX("portswigger.net/web-security", "PortSwigger Web Security Academy — platform latihan web security gratis dengan ratusan lab interaktif.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Apa itu OWASP?</h3>
<p style="font-size:0.9rem;"><strong>Open Web Application Security Project</strong> — organisasi non-profit yang menjadi standar referensi web security global. Setiap beberapa tahun mereka rilis <strong>OWASP Top 10</strong> berdasarkan data dari ratusan ribu aplikasi web nyata di seluruh dunia.</p>

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">📋 OWASP Top 10 — 2021 Edition</h3>

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#E53935;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A01</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Broken Access Control ⬆️ #5 → #1</p>
<p style="margin:0;font-size:0.87rem;">User bisa mengakses data atau fungsi yang seharusnya tidak boleh mereka sentuh. Contoh klasik: ganti <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/profile/123</code> jadi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/profile/124</code> dan kamu bisa lihat data orang lain — ini IDOR, salah satu bentuk Broken Access Control. Kita praktek di Video 13.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#E65100;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A02</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Cryptographic Failures</p>
<p style="margin:0;font-size:0.87rem;">Data sensitif tidak dienkripsi, atau pakai algoritma yang sudah lemah (MD5, SHA1). Ini yang menyebabkan password dari breach Tokopedia bisa di-crack — mereka pakai MD5 tanpa salt.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#F57C00;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A03</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Injection — SQL, Command, LDAP</p>
<p style="margin:0;font-size:0.87rem;">Input user tidak difilter dan langsung dieksekusi sebagai kode. SQL Injection termasuk di sini — kita praktek di Video 11 dengan SQLmap langsung ke database target.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#F9A825;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A04</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Insecure Design</p>
<p style="margin:0;font-size:0.87rem;">Celah ada sejak tahap desain sistem — bukan dari coding yang buruk, tapi dari arsitektur yang tidak memikirkan keamanan sejak awal. Tidak ada validasi business logic yang benar.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#7CB342;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A05</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Security Misconfiguration</p>
<p style="margin:0;font-size:0.87rem;">Default credentials yang tidak diganti, error messages yang terlalu verbose (bocorkan stack trace), fitur debug masih aktif di production, directory listing terbuka. Sangat umum dan mudah ditemukan.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#00897B;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A06</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Vulnerable and Outdated Components</p>
<p style="margin:0;font-size:0.87rem;">Pakai library, framework, atau OS dengan versi yang sudah ada CVE-nya. Equifax kehilangan 147 juta data karena ini — mereka tidak update Apache Struts selama 2 bulan setelah patch tersedia.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#1976D2;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A07</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Identification & Authentication Failures</p>
<p style="margin:0;font-size:0.87rem;">Login yang lemah, tidak ada proteksi brute force, session token yang mudah ditebak, tidak ada multi-factor authentication. Kita praktek bypass ini di Video 13.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#5E35B1;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A08</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Software & Data Integrity Failures</p>
<p style="margin:0;font-size:0.87rem;">Update software atau plugin yang tidak diverifikasi integritasnya bisa disusupi kode berbahaya sebelum sampai ke pengguna. Supply chain attacks.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#6D4C41;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A09</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Security Logging & Monitoring Failures</p>
<p style="margin:0;font-size:0.87rem;">Tidak ada log yang memadai. Penyerang bisa beroperasi berbulan-bulan tanpa ketahuan. Rata-rata waktu deteksi breach di dunia: <strong>207 hari</strong>. Sebagian besar karena logging yang buruk.</p></div></div>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;">
<span style="flex-shrink:0;background:#455A64;color:white;font-size:0.75rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:6px;margin-top:0.1rem;">A10</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;">Server-Side Request Forgery (SSRF)</p>
<p style="margin:0;font-size:0.87rem;">Server dipaksa melakukan request ke internal sistem yang tidak bisa diakses dari luar. Bisa digunakan untuk membaca metadata cloud, akses internal API, atau pivot ke sistem internal.</p></div></div>`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.75rem 0 0.5rem;">🗺️ Yang Akan Kita Praktek di Modul Ini</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:0.5rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">OWASP</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Video</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Platform</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">A03 — Injection</td><td style="padding:0.5rem 0.8rem;">Video 11 — SQL Injection</td><td style="padding:0.5rem 0.8rem;">testphp.vulnweb.com + SQLmap</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">A03 — XSS</td><td style="padding:0.5rem 0.8rem;">Video 12 — XSS</td><td style="padding:0.5rem 0.8rem;">PortSwigger Labs</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">A07 — Auth Failures</td><td style="padding:0.5rem 0.8rem;">Video 13 — Auth Bypass</td><td style="padding:0.5rem 0.8rem;">PortSwigger Labs</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">A01 — Broken Access Control</td><td style="padding:0.5rem 0.8rem;">Video 13 — IDOR</td><td style="padding:0.5rem 0.8rem;">PortSwigger Labs</td></tr>
</tbody></table>
${note("🎯 <strong>Action sekarang:</strong> Daftar akun gratis di portswigger.net/web-security — kamu akan butuhkannya mulai video 11.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 11: SQL Injection ─────────────────────────────────────────────────
{
  title: "💉 SQL Injection — Konsep & Demo di Lab",
  module_index: 4,
  order_index: 1,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">💉 SQL Injection — Konsep & Demo di Lab</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 11. Ikuti langkah-langkah ini step by step — kamu akan berhasil masuk ke dalam database target.</p>
${TARGET_BOX("testphp.vulnweb.com + portswigger.net/web-security/sql-injection", "Domain latihan resmi Acunetix + PortSwigger Labs. Keduanya legal sepenuhnya.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Apa yang Terjadi di Balik Form Login</h3>
<p style="font-size:0.9rem;">Setiap kali kamu login, server menjalankan query SQL seperti ini:</p>
${codeBlock(`SELECT * FROM users WHERE username='faris' AND password='12345'`, "#FFD700")}
<p style="font-size:0.9rem;">SQL Injection terjadi ketika input user tidak difilter dan langsung masuk ke query. Penyerang bisa mengubah logika query — bahkan melewati autentikasi sama sekali.</p>

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo 1: Login Bypass di PortSwigger</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Langkah-langkah:</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Buka <strong>portswigger.net/web-security/sql-injection</strong> → pilih lab "SQL injection vulnerability in WHERE clause" → Access the lab</li>
<li style="margin-bottom:0.5rem;">Perhatikan URL filter kategori: <code style="background:#1E1E1E;color:#A8FF78;padding:0.1rem 0.4rem;border-radius:4px;">/filter?category=Gifts</code></li>
<li style="margin-bottom:0.5rem;">Query di balik layar:<br/>${codeBlock(`SELECT * FROM products WHERE category='Gifts' AND released=1`, "#FFD700")}</li>
<li style="margin-bottom:0.5rem;">Inject payload — ubah URL jadi:<br/>${codeBlock(`/filter?category=Gifts'--`)}</li>
<li style="margin-bottom:0.5rem;">Query yang dieksekusi sekarang:<br/>${codeBlock(`SELECT * FROM products WHERE category='Gifts'--' AND released=1`, "#FFD700")}<br/><em style="font-size:0.82rem;color:#666;">Bagian setelah -- diabaikan — produk tersembunyi ikut muncul.</em></li>
<li>Coba lebih jauh — tampilkan SEMUA produk:<br/>${codeBlock(`/filter?category='+OR+1=1--`)}</li>
</ol>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo 2: SQLmap di testphp.vulnweb.com</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Step 1 — Deteksi manual</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Buka <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">testphp.vulnweb.com/listproducts.php?cat=1'</code> di browser. Kalau muncul error SQL syntax → confirmed vulnerable.</p>
<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Step 2 — Dump nama database</p>
${codeBlock(`sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" --dbs`)}
<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Step 3 — Dump tabel dari database acuart</p>
${codeBlock(`sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" -D acuart --tables`)}
<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Step 4 — Dump isi tabel users</p>
${codeBlock(`sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1" -D acuart -T users --dump`)}
${note("⭐ Kamu akan melihat nama, email, dan password dari tabel users — semua dari satu parameter yang tidak difilter.", "#FFF3D6", "#F5A62A")}`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.5rem 0 0.5rem;">📋 Cheatsheet SQL Injection Payloads</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Payload</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Tujuan</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">'</td><td style="padding:0.5rem 0.8rem;">Test — cek apakah ada error SQL</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">'--</td><td style="padding:0.5rem 0.8rem;">Comment out sisa query (MySQL)</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">' OR 1=1--</td><td style="padding:0.5rem 0.8rem;">Selalu true — bypass kondisi WHERE</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">' OR '1'='1</td><td style="padding:0.5rem 0.8rem;">Login bypass tanpa comment</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">admin'--</td><td style="padding:0.5rem 0.8rem;">Login sebagai admin tanpa password</td></tr>
</tbody></table>
${note("⚠️ <strong>Penting:</strong> SQLmap dan teknik ini hanya boleh digunakan di sistem yang kamu miliki atau sudah dapat izin tertulis. testphp.vulnweb.com adalah domain resmi latihan.", "#FFF5F5", "#E53935")}
${note("🎯 <strong>Next step:</strong> Video 12 — XSS. Kalau SQLi menyerang database, XSS menyerang browser pengguna.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 12: XSS ───────────────────────────────────────────────────────────
{
  title: "🖥️ XSS (Cross-Site Scripting) — Reflected, Stored, DOM",
  module_index: 4,
  order_index: 2,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🖥️ XSS — Cross-Site Scripting: Reflected, Stored, DOM</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 12. Kita praktek ketiga tipe XSS langsung di PortSwigger Labs.</p>
${TARGET_BOX("portswigger.net/web-security/cross-site-scripting", "PortSwigger Web Security Academy — daftar gratis, ratusan XSS lab tersedia.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Apa itu XSS?</h3>
<p style="font-size:0.9rem;">Cross-Site Scripting adalah serangan di mana penyerang berhasil menyisipkan script JavaScript berbahaya ke dalam halaman web, yang kemudian <strong>dieksekusi di browser korban</strong> — bukan di server penyerang.</p>
<p style="font-size:0.9rem;margin-top:0.5rem;">Ada tiga jenis — dan ketiganya punya cara kerja yang berbeda:</p>

<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Tipe 1: Reflected XSS</h3>
<p style="font-size:0.88rem;">Input user langsung ditampilkan kembali di halaman tanpa difilter — biasanya lewat URL parameter. Payload harus dikirim ke korban via link.</p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: Reflected XSS into HTML context with nothing encoded</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Buka lab di PortSwigger → Access the lab</li>
<li style="margin-bottom:0.4rem;">Ketik sembarang teks di search box → perhatikan teks muncul di halaman (di-reflect)</li>
<li style="margin-bottom:0.4rem;">Sekarang ketik payload ini:${codeBlock(`<script>alert('XSS')</script>`)}</li>
<li>Tekan Enter → popup alert muncul → <strong>XSS berhasil ✓</strong></li>
</ol>
<p style="margin:0.75rem 0 0;font-size:0.82rem;color:#666;">Di dunia nyata: kirim link <code>?search=&lt;script&gt;...&lt;/script&gt;</code> ke korban. Mereka klik, script kamu jalan di browser mereka.</p>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Tipe 2: Stored XSS</h3>
<p style="font-size:0.88rem;">Payload tersimpan di database server dan dieksekusi setiap kali halaman dimuat oleh siapapun. Ini yang paling berbahaya — tidak perlu korban klik link apapun.</p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: Stored XSS into HTML context with nothing encoded</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Buka lab → ada blog post dengan kolom komentar</li>
<li style="margin-bottom:0.4rem;">Di kolom <strong>Comment</strong>, masukkan:${codeBlock(`<script>alert(document.cookie)</script>`)}</li>
<li style="margin-bottom:0.4rem;">Submit komentar</li>
<li style="margin-bottom:0.4rem;">Buka blog post lagi → popup muncul menampilkan cookie session kamu</li>
<li>Siapapun yang buka halaman ini → script jalan → cookie mereka bisa dicuri ✓</li>
</ol>
${note("⭐ Dalam serangan nyata, script tidak hanya alert — tapi kirim cookie ke server penyerang. Penyerang bisa ambil alih akun tanpa tahu password.", "#FFF3D6", "#F5A62A")}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Tipe 3: DOM-based XSS</h3>
<p style="font-size:0.88rem;">Celah ada di JavaScript sisi client — bukan di server. JavaScript di halaman itu sendiri mengeksekusi input user secara tidak aman via DOM manipulation.</p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: DOM XSS in document.write sink using source location.search</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Buka lab → ada search box</li>
<li style="margin-bottom:0.4rem;">Buka DevTools (F12) → Sources → perhatikan halaman pakai <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">document.write()</code> dengan <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">location.search</code></li>
<li style="margin-bottom:0.4rem;">Di URL bar, tambahkan:${codeBlock(`?search="><svg onload=alert(1)>`)}</li>
<li>Popup muncul — DOM XSS berhasil tanpa tag &lt;script&gt; ✓</li>
</ol>`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.75rem 0 0.5rem;">📋 XSS Payload Cheatsheet</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Payload</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Keterangan</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;font-size:0.8rem;">&lt;script&gt;alert(1)&lt;/script&gt;</td><td style="padding:0.5rem 0.8rem;">Basic — test dasar</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;font-size:0.8rem;">&lt;script&gt;alert(document.cookie)&lt;/script&gt;</td><td style="padding:0.5rem 0.8rem;">Tampilkan cookie</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;font-size:0.8rem;">&lt;svg onload=alert(1)&gt;</td><td style="padding:0.5rem 0.8rem;">Bypass filter &lt;script&gt;</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;font-size:0.8rem;">&lt;img src=x onerror=alert(1)&gt;</td><td style="padding:0.5rem 0.8rem;">Event handler — tidak butuh closing tag</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;font-size:0.8rem;">javascript:alert(1)</td><td style="padding:0.5rem 0.8rem;">Di dalam href atau src attribute</td></tr>
</tbody></table>

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.75rem 0 0.5rem;">🌍 Kasus Nyata — Samy Worm 2005</h3>
${card(`<p style="margin:0;font-size:0.87rem;">Seorang bernama <strong>Samy Kamkar</strong> membuat worm XSS di MySpace tahun 2005. Scriptnya tersimpan di profil dan otomatis menyalin dirinya ke profil siapapun yang melihat halamannya. Dalam <strong>20 jam</strong>, lebih dari <strong>1 juta profil terinfeksi</strong> — terbesar dalam sejarah saat itu. Dengan satu orang, satu script.</p>`)}

${note("🎯 <strong>Next step:</strong> Video 13 — Authentication Bypass & Broken Access Control. Cara masuk ke sistem tanpa password.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 13: Auth Bypass & Broken Access Control ───────────────────────────
{
  title: "🔐 Authentication Bypass & Broken Access Control",
  module_index: 4,
  order_index: 3,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🔐 Authentication Bypass & Broken Access Control</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 13. Kita praktek masuk ke sistem tanpa password dan akses data orang lain.</p>
${TARGET_BOX("portswigger.net/web-security/authentication + /access-control", "PortSwigger Web Security Academy — butuh akun gratis.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔑 Teknik 1: Default Credentials</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Coba kombinasi ini di setiap login form yang kamu temukan:</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Username</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Password</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">admin</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">admin</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">admin</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">password</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">admin</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">123456</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">root</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">root</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">administrator</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">(kosong)</td></tr>
</tbody></table>
<p style="margin:0.6rem 0 0;font-size:0.82rem;color:#666;">Database default credentials lengkap: <strong>default-password.info</strong> — search berdasarkan vendor atau model device.</p>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔑 Teknik 2: Username Enumeration + Brute Force</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: Username enumeration via different responses</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Buka lab → coba login dengan username random → perhatikan pesan error: <em>"Invalid username"</em></li>
<li style="margin-bottom:0.5rem;">Coba username yang valid → pesan error berbeda: <em>"Incorrect password"</em><br/>→ Perbedaan ini <strong>membocorkan username valid</strong></li>
<li style="margin-bottom:0.5rem;">Di Burp Suite: aktifkan Intercept → coba login → request tertangkap → Send to Intruder</li>
<li style="margin-bottom:0.5rem;">Set payload position di field <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">username</code> → load wordlist:<br/>${codeBlock(`/usr/share/wordlists/seclists/Usernames/Names/names.txt`)}</li>
<li style="margin-bottom:0.5rem;">Launch attack → filter response yang panjangnya berbeda → itu username yang valid</li>
<li>Ulangi dengan username valid, brute force password dengan wordlist <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">rockyou.txt</code></li>
</ol>
${note("Wordlist rockyou.txt di Kali ada di: <code>/usr/share/wordlists/rockyou.txt.gz</code> — extract dulu dengan <code>gunzip rockyou.txt.gz</code>", "#FFF3D6", "#F5A62A")}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔑 Teknik 3: SQL Injection di Login Form</h3>
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;">Kalau login form vulnerable terhadap SQLi, kamu bisa bypass tanpa tahu password sama sekali. Masukkan di field username:</p>
${codeBlock(`admin'--`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Query yang dieksekusi:</p>
${codeBlock(`SELECT * FROM users WHERE username='admin'--' AND password='apapun'`, "#FFD700")}
<p style="margin:0;font-size:0.87rem;">Bagian password diabaikan oleh komentar <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">--</code> → login berhasil sebagai admin.</p>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔓 Broken Access Control: IDOR</h3>
<p style="font-size:0.88rem;margin-bottom:0.75rem;"><strong>Insecure Direct Object Reference</strong> — aplikasi mengekspos ID objek internal tanpa memverifikasi apakah kamu berhak mengaksesnya.</p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: Insecure direct object references</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Buka lab → ada fitur live chat → klik <strong>View transcript</strong></li>
<li style="margin-bottom:0.5rem;">URL download transcript: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/download-transcript/2.txt</code></li>
<li style="margin-bottom:0.5rem;">Ganti <strong>2</strong> jadi <strong>1</strong>: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/download-transcript/1.txt</code></li>
<li style="margin-bottom:0.5rem;">Download transcript orang lain → di dalamnya ada password yang pernah diketik di chat</li>
<li>Gunakan password itu untuk login sebagai user carlos → Lab solved ✓</li>
</ol>
${note("⭐ Satu angka di URL membuka data orang lain. IDOR adalah salah satu temuan bug bounty paling umum — dan paling mudah ditemukan.", "#FFF3D6", "#F5A62A")}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔓 Privilege Escalation: Parameter Tampering</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: User role controlled by request parameter</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Login sebagai user normal → buka Burp Suite, aktifkan Intercept</li>
<li style="margin-bottom:0.5rem;">Browse ke halaman admin → request tertangkap di Burp</li>
<li style="margin-bottom:0.5rem;">Perhatikan cookie atau parameter: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">Admin=false</code></li>
<li style="margin-bottom:0.5rem;">Ubah jadi: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">Admin=true</code></li>
<li>Forward request → kamu sekarang di panel admin → Lab solved ✓</li>
</ol>`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.75rem 0 0.5rem;">📋 Ringkasan Teknik</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Teknik</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">OWASP</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Tools</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">Default Credentials</td><td style="padding:0.5rem 0.8rem;">A07</td><td style="padding:0.5rem 0.8rem;">Manual / default-password.info</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">Username Enumeration + Brute Force</td><td style="padding:0.5rem 0.8rem;">A07</td><td style="padding:0.5rem 0.8rem;">Burp Intruder + wordlist</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">SQLi Login Bypass</td><td style="padding:0.5rem 0.8rem;">A03 + A07</td><td style="padding:0.5rem 0.8rem;">Manual</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">IDOR</td><td style="padding:0.5rem 0.8rem;">A01</td><td style="padding:0.5rem 0.8rem;">Manual / Burp</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;">Parameter Tampering</td><td style="padding:0.5rem 0.8rem;">A01 + A07</td><td style="padding:0.5rem 0.8rem;">Burp Intercept</td></tr>
</tbody></table>
${note("🎯 <strong>Next step:</strong> Video 14 — Directory Traversal & File Inclusion. Cara mengakses file di server yang tidak seharusnya bisa dibuka dari web.", "#F0F7E8", "#7AB648")}
</div>`
}

]; // end articles array

async function main() {
  for (const a of articles) {
    const { data, error } = await supabase
      .from("materials")
      .insert({
        course_slug: "cyber-security-pemula",
        title: a.title,
        content: a.content,
        video_url: null,
        module_index: a.module_index,
        order_index: a.order_index,
      })
      .select("id, title, module_index, order_index")
      .single();

    if (error) {
      console.error(`❌ [mod:${a.module_index} ord:${a.order_index}] ${a.title}\n   ${error.message}`);
    } else {
      console.log(`✅ [mod:${data.module_index} ord:${data.order_index}] ${data.title}`);
    }
  }

  console.log("\n📋 Final check:");
  for (const mod of [3, 4]) {
    const { data } = await supabase
      .from("materials")
      .select("title, order_index")
      .eq("course_slug", "cyber-security-pemula")
      .eq("module_index", mod)
      .order("order_index");
    console.log(`  Modul ${mod}:`, data?.map(m => `[${m.order_index}] ${m.title.slice(0, 40)}`));
  }
}

main();
