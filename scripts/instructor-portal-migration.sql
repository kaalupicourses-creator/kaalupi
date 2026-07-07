-- ============================================================
-- INSTRUCTOR PORTAL — jalanin di Supabase SQL Editor (sekali aja)
-- Pilih "Run and enable RLS" pas ditanya.
-- ============================================================

create table if not exists instructor_assignments (
  id uuid primary key default gen_random_uuid(),
  instructor_email text not null,
  course_slug text not null,
  commission_pct int not null default 30,
  target_materials int not null default 0,
  deadline date,
  created_at timestamptz default now(),
  unique (instructor_email, course_slug)
);

create index if not exists idx_instructor_assignments_email
  on instructor_assignments (instructor_email);

-- Selesai. Status "ban" instructor disimpan di Clerk metadata, bukan di sini.
