-- Migration: Manual payment submissions table.
-- Run di Supabase SQL Editor.
--
-- Flow: user klik "Sudah Bayar" di /checkout/[slug] → record dibuat di sini
-- dengan status='pending'. Admin di /dashboard/payments approve atau reject.
-- Approve = enrollment di-create + (kalau Mastery) Founding Member badge granted.

CREATE TABLE IF NOT EXISTS payment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  user_phone TEXT,
  user_id_clerk TEXT,
  course_slug TEXT NOT NULL,
  course_title TEXT,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- dana | bsi | bca | qris
  sender_account TEXT,          -- info dari user (no rekening / nama pengirim)
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  notes TEXT,                   -- catatan admin
  whatsapp_sent BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,             -- email admin yg approve/reject
  CONSTRAINT payment_status_valid CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT payment_method_valid CHECK (payment_method IN ('dana', 'bsi', 'bca', 'qris'))
);

CREATE INDEX IF NOT EXISTS idx_payment_submissions_status
  ON payment_submissions(status);

CREATE INDEX IF NOT EXISTS idx_payment_submissions_user_email
  ON payment_submissions(user_email);

CREATE INDEX IF NOT EXISTS idx_payment_submissions_submitted_at
  ON payment_submissions(submitted_at DESC);

-- RLS: only service role can read/write (admin via API)
ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_payment_submissions" ON payment_submissions;
CREATE POLICY "service_role_all_payment_submissions"
  ON payment_submissions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
