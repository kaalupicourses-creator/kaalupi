# Cara Insert Materials ke Supabase

## Metode 1: SQL Editor (Paling Mudah)

1. Buka https://supabase.com/dashboard
2. Login dengan akun Kaalupi
3. Pilih project: **kaalupi** (atau nama project yang terdaftar)
4. Di sidebar kiri, klik **SQL Editor**
5. Klik **+ New Query**
6. Copy-paste isi file `supabase/seed-ai-pemula.sql` (buka dengan Notepad/VSCode)
7. Klik **Run** (tombol hijau di kanan atas)
8. Tunggu hingga muncul pesan: `INSERT 0 15` (berarti 15 materials berhasil diinsert)

---

## Metode 2: Check Hasil Insert

Jalankan SQL berikut di SQL Editor:

```sql
SELECT 
  module_index, 
  COUNT(*) as total_materials,
  STRING_AGG(title, ', ') as titles
FROM materials
WHERE course_slug = 'ai-untuk-pemula'
GROUP BY module_index
ORDER BY module_index;
```

Hasil yang diharapkan:
- Module 0 (Apa itu AI + Lab): 2 materials
- Module 1 (Prompt Engineering + Lab): 3 materials  
- Module 2 (Produktivitas + Lab): 3 materials
- Module 3 (Bisnis & Karier + Lab): 3 materials
- Module 4 (Tools + Workflow + Final Project): 3 materials

---

## Metode 3: Update Video URL (Setelah Video Direkam)

Setelah video diupload ke YouTube, update URL-nya:

```sql
UPDATE materials 
SET video_url = 'https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID'
WHERE course_slug = 'ai-untuk-pemula' 
  AND module_index = 0  -- Ganti dengan module yang sesuai
  AND order_index = 0;  -- Ganti dengan order yang sesuai
```

---

## Metode 4: Verifikasi di Website

1. Buka https://kaalupi.vercel.app/courses/ai-untuk-pemula
2. Klik **Beli Sekarang** (karena gratis, langung masuk)
3. Buka https://kaalupi.vercel.app/access/ai-untuk-pemula
4. Cek apakah 5 module sudah muncul dengan konten lengkap

---

## Troubleshooting

**Error: `duplicate key value violates unique constraint`**
→ Materials sudah ada. Tambahkan `ON CONFLICT` di SQL atau hapus dulu:
```sql
DELETE FROM materials WHERE course_slug = 'ai-untuk-pemula';
```

**Error: `permission denied`**
→ Cek RLS (Row Level Security) di Supabase. Pastikan user punya akses ke tabel `materials`.

**Video tidak muncul:**
→ Cek `video_url` di tabel materials. Pastikan URL valid YouTube/Google Drive.

---

## Next Steps Setelah Materials Terinsert:

1. ✅ **Record Video** - Gunakan script di `scripts/video-scripts-ai-pemula.md`
2. ✅ **Upload ke YouTube** - Set ke "Unlisted" dulu, ambil URL
3. ✅ **Update `video_url`** - Di Supabase lewat SQL Editor
4. ✅ **Test di Website** - Pastikan video bisa diputar di access page
5. ✅ **Commit & Push** - Simpan semua perubahan ke GitHub

---

## Kontak Darurat

Jika ada kendala teknis:
- Email: kamilalfaris@gmail.com
- Cek dokumentasi: `PROJECT_DETAILS.md`
- Cek schema: `supabase/schema.sql`
