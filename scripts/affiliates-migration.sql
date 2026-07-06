-- ============================================================
-- SISTEM AFILIASI — jalanin di Supabase SQL Editor (sekali aja)
-- ============================================================

-- 1. Tabel afiliasi
create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  email text,
  commission_pct int not null default 20,
  created_at timestamptz default now()
);

-- 2. Tambah kolom referral_code ke payment_submissions
alter table payment_submissions
  add column if not exists referral_code text;

-- 3. Index biar query komisi cepet
create index if not exists idx_payment_submissions_referral
  on payment_submissions (referral_code);

-- Selesai. Sekarang menu "Sistem Afiliasi" di dashboard super admin udah bisa dipake.
