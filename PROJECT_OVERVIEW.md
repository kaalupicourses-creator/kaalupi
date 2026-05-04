# Kaalupi Project Overview

## Ringkasan
Kaalupi adalah website course IT yang diposisikan sebagai platform pembelajaran profesional untuk jalur karier teknologi seperti programming, network engineer, cyber security, designer, dan topik digital lain yang relevan. Produk ini dibangun sebagai fondasi course marketplace yang bisa dipublikasikan ke Vercel dan dikembangkan lanjut ke sistem produksi penuh.

## Tujuan Produk
- Menyediakan landing page yang kuat untuk marketing dan branding.
- Menampilkan katalog course dan halaman detail course yang siap dijual.
- Menyediakan role-based experience untuk admin, instructor, dan student.
- Menyediakan alur pembayaran yang siap dihubungkan ke payment gateway real.
- Memberikan akses materi hanya setelah pembayaran tervalidasi.
- Menjadi baseline project yang mudah diaudit atau diteruskan oleh AI/engineer lain.

## Visi
Menjadi platform pembelajaran IT yang membantu lebih banyak orang membangun skill digital yang nyata, terstruktur, dan relevan dengan kebutuhan industri.

## Misi
- Membuat kurikulum yang jelas dan bisa diikuti step by step.
- Menghubungkan konten belajar dengan outcome kerja dan portofolio.
- Memberi instructor tempat untuk menjual materi dengan tata kelola yang rapi.
- Menjaga kualitas experience user dari landing page sampai akses materi.
- Menyiapkan arsitektur yang siap diintegrasikan ke database, auth production, dan payment production.

## Scope MVP Saat Ini
- Public pages: home, about, contact, courses, blog.
- Protected pages: dashboard, content publishing, access.
- Demo auth dengan role admin, instructor, student.
- Demo content publishing untuk admin/instructor.
- Checkout flow dengan fallback mock dan adapter Midtrans.
- Payment finalize flow untuk mengaktifkan akses course setelah sukses.
- Webhook endpoint yang sudah siap dihubungkan ke database produksi.

## Privilege Model
- Admin:
  - Full oversight platform.
  - Bisa publish course.
  - Bisa monitor struktur produk dan payment flow.
- Instructor:
  - Bisa publish materi/course baru.
  - Bisa mengelola konten yang dijual.
- Student:
  - Bisa login, checkout, dan akses materi setelah pembayaran sukses.

## Arsitektur Teknis
- Framework: Next.js App Router.
- Styling: Tailwind CSS v4.
- Session: signed cookie berbasis server secret.
- Data default: static seed local untuk MVP.
- Payment adapter: Midtrans Snap redirect mode.
- Deployment target: Vercel.

## Catatan Penting Audit
- Auth saat ini masih demo auth, belum menggunakan database user production.
- Enrollment dan custom course masih disimpan dalam signed cookie untuk kebutuhan MVP/demo.
- Untuk produksi, state penting harus dipindah ke database persisten.
- Webhook payment sudah ada, tetapi persistence enrollment lintas device/browser tetap butuh database.

## Rekomendasi Tahap Berikutnya
1. Tambah database production seperti Neon/Postgres atau Supabase Postgres.
2. Ganti demo auth ke provider production seperti NextAuth/Auth.js atau Clerk.
3. Simpan course, user, order, dan enrollment ke database.
4. Hubungkan Midtrans webhook ke tabel orders/enrollments.
5. Tambah CMS/instructor studio yang lebih lengkap.
6. Tambah streaming video, progress tracking, quiz, dan certificate.
