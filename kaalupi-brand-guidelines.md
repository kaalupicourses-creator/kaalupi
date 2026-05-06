# Kaalupi Brand Guidelines
**Version 1.0 — Mei 2026**

---

## 1. Logo

Logo Kaalupi terdiri dari tiga elemen:
- Huruf **"k"** besar berwarna Amber — simbol brand yang hangat dan approachable
- Teks **"kaalupi"** berwarna Forest Green — tegas, natural, terpercaya
- **Tiga garis spark** berwarna Spark Green di kanan atas — simbol energi, semangat belajar, dan momen "aha!"

**Aturan logo:**
- Jangan ubah proporsi atau warna logo
- Jangan taruh logo di atas background yang warnanya mirip Amber
- Gunakan versi dark background (logo putih/amber) untuk thumbnail gelap
- Ukuran minimum logo: 80px lebar

---

## 2. Palet Warna Utama

| Nama | Hex | Penggunaan |
|---|---|---|
| **Kaalupi Amber** | `#F5A62A` | Primary CTA, tombol utama, highlight penting |
| **Forest Green** | `#2D5016` | Teks heading, background button sekunder, brand identity |
| **Spark Green** | `#7AB648` | Aksen kecil, ikon, bullet aktif, badge "lulus" |
| **Warm White** | `#FEFBF5` | Background halaman (light mode) |
| **Deep Forest** | `#1A2E0A` | Background gelap, thumbnail course, dark mode |

---

## 3. Warna Pendukung

| Nama | Hex | Penggunaan |
|---|---|---|
| **Amber Tint** | `#FFF3D6` | Background card highlight, callout box |
| **Green Tint** | `#E8F5D6` | Badge sukses, indikator lulus, progress selesai |
| **Warm Sand** | `#F0E8D8` | Divider, muted background, border card |
| **Dark Amber** | `#5C4813` | Teks di atas Amber Tint (kontras aman) |
| **Alert Red** | `#C0392B` | Error, warning, notifikasi penting — hanya untuk ini |

---

## 4. Kombinasi Warna yang Direkomendasikan

### Tombol CTA Utama (Daftar / Bayar / Mulai)
- Background: `#F5A62A` (Amber)
- Teks: `#2D5016` (Forest Green)

### Tombol CTA Sekunder (Lihat Detail / Pelajari Lebih)
- Background: `#2D5016` (Forest Green)
- Teks: `#F5A62A` (Amber)

### Halaman Light Mode
- Background: `#FEFBF5` (Warm White)
- Teks utama: `#2D5016` (Forest Green)
- Teks body: `#444444`

### Thumbnail Course / Dark Mode
- Background: `#1A2E0A` (Deep Forest)
- Teks/judul: `#F5A62A` (Amber)
- Aksen: `#7AB648` (Spark Green)

---

## 5. Badge & Tag

| Tag | Background | Teks |
|---|---|---|
| Beginner | `#FFF3D6` | `#5C4813` |
| Gratis | `#E8F5D6` | `#2D5016` |
| Best Seller | `#2D5016` | `#F5A62A` |
| New | `#F5A62A` | `#2D5016` |
| ✓ Lulus | `#1A2E0A` | `#7AB648` |

---

## 6. Tipografi

### Font Utama
```
font-family: 'Nunito', 'Poppins', 'Plus Jakarta Sans', sans-serif;
```

**Kenapa Nunito/Poppins?**  
Rounded, friendly, modern — cocok untuk tone brand Kaalupi yang "kakak senior, bukan dosen."

### Hierarki Teks

| Level | Size | Weight | Penggunaan |
|---|---|---|---|
| Display / Hero | 40–56px | 700 Bold | Judul besar di landing page |
| H1 Section | 28–36px | 700 Bold | Judul seksi |
| H2 Subsection | 22–26px | 600 SemiBold | Subjudul |
| H3 Card Title | 18–20px | 500 Medium | Judul card course |
| Body | 15–16px | 400 Regular | Paragraf, deskripsi |
| Caption / Label | 12–13px | 400–500 | Tag, badge, keterangan kecil |

### Import Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 7. Radius & Spacing

| Elemen | Border Radius |
|---|---|
| Tombol | `9999px` (pill) |
| Card course | `16px` |
| Badge/tag | `9999px` (pill) |
| Input form | `8px` |
| Thumbnail image | `12px` |

**Spacing dasar:** gunakan kelipatan 4px (4, 8, 12, 16, 24, 32, 48, 64)

---

## 8. Tone of Voice

Kaalupi bicara seperti **kakak senior yang sudah kerja** — bukan dosen, bukan sales agent.

**Gunakan:**
- "kamu" bukan "Anda"
- Kalimat pendek dan jelas
- Bahasa Indonesia sehari-hari, boleh campur sedikit Inggris kalau lebih natural
- Jujur tentang effort: "course ini butuh ~7 jam" bukan "belajar dalam sekejap!"
- Selalu ada output nyata: "setelah modul ini kamu bisa..."

**Hindari:**
- Bahasa terlalu formal / kaku
- Klaim berlebihan ("pasti langsung dapat kerja")
- Jargon teknis tanpa penjelasan
- Emoji berlebihan

---

## 9. Do & Don't Visual

### Warna
- ✅ Amber + Forest Green sebagai pasangan utama
- ✅ Spark Green hanya untuk aksen kecil (ikon, bullet, badge)
- ✅ Amber Tint untuk background card yang ringan
- ❌ Amber di atas Amber Tint — kontras terlalu rendah
- ❌ Spark Green sebagai background lebar
- ❌ Merah untuk hal selain error/warning

### Tipografi
- ✅ Nunito atau Poppins untuk semua teks UI
- ✅ Bold untuk judul, Regular untuk body
- ❌ Font serif (Times, Georgia) — tidak sesuai brand
- ❌ Terlalu banyak weight berbeda dalam satu halaman (max 3)

### Logo
- ✅ Logo di atas background putih/cream atau gelap
- ❌ Logo di atas background Amber — tidak kontras
- ❌ Meregangkan atau memotong logo

---

## 10. Aplikasi per Platform

### Instagram Feed
- Rasio: 1:1 (1080×1080px) atau 4:5 (1080×1350px)
- Background: Warm White atau Deep Forest
- Font: Nunito Bold untuk headline
- Warna dominan: Amber atau Forest Green

### YouTube Thumbnail
- Ukuran: 1280×720px
- Background: Deep Forest (`#1A2E0A`)
- Judul: Amber (`#F5A62A`), bold, besar
- Aksen: Spark Green untuk highlight

### WhatsApp Business
- Profile photo: Logo Kaalupi di background Warm White
- Tone pesan: santai, pakai "kamu", respons max 1 jam

### Website (kaalupi.com)
- Light mode default
- Primary button: Amber
- Secondary button: outline Forest Green
- Cards: background Warm White + border Warm Sand

---

*Dokumen ini adalah referensi visual tim Kaalupi. Update jika ada perubahan branding.*  
*Terakhir diupdate: Mei 2026*
