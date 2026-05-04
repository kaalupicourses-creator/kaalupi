-- ================================================================
-- Kaalupi — Supabase RLS Policies
-- Jalankan file ini di Supabase Dashboard → SQL Editor
-- Pastikan schema.sql sudah dijalankan terlebih dahulu
-- ================================================================

-- ---------------------------------------------------------------
-- COURSES — siapa pun bisa membaca course
-- ---------------------------------------------------------------
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage courses"
  ON courses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- ENROLLMENTS — user bisa melihat enrollment berdasarkan email
-- ---------------------------------------------------------------
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage enrollments"
  ON enrollments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- ORDERS — user bisa melihat dan membuat order mereka sendiri
-- ---------------------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (true);

CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- PROGRESS — user bisa melihat dan update progress mereka
-- ---------------------------------------------------------------
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create progress"
  ON progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own progress"
  ON progress FOR UPDATE
  USING (true);

CREATE POLICY "Service role can manage progress"
  ON progress FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- MATERIALS — siapa pun bisa membaca materi course
-- ---------------------------------------------------------------
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage materials"
  ON materials FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- WAITLIST — tabel baru untuk pendaftar waitlist
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama        TEXT NOT NULL,
  email       TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  tipe_user   TEXT NOT NULL CHECK (tipe_user IN ('Mahasiswa', 'Fresh Graduate', 'Karyawan', 'Lainnya')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can read waitlist"
  ON waitlist FOR SELECT
  TO service_role
  USING (true);
