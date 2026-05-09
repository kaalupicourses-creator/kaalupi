-- Migration: Tambah badge "Founding Member" untuk 100 orang pertama
-- yang enroll Mastery course. Run di Supabase SQL Editor.
--
-- Note: badges.name awalnya belum punya UNIQUE constraint, jadi kita
-- tambah dulu, baru INSERT ... ON CONFLICT (name) bisa jalan.
-- user_badges punya kolom 'earned_at' (bukan 'awarded_at').

-- Step 1: Add UNIQUE constraint on badges.name (only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'badges_name_key'
  ) THEN
    -- Hapus duplikat dulu kalau ada (keep yang paling lama)
    DELETE FROM badges
    WHERE id NOT IN (
      SELECT MIN(id) FROM badges GROUP BY name
    );
    ALTER TABLE badges ADD CONSTRAINT badges_name_key UNIQUE (name);
  END IF;
END $$;

-- Step 2: Insert / update Founding Member badge
INSERT INTO badges (name, description, icon, required_points)
VALUES (
  'Founding Member',
  'Salah satu dari 100 orang pertama yang percaya sama Kaalupi dari hari pertama. Lifetime access ke semua course.',
  '🏛️',
  0
)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- Step 3: Auto-grant Founding Member badge ke siapapun yg sudah punya
-- enrollment aktif di Mastery course. Re-run kapanpun setelah batch enrollment baru.
INSERT INTO user_badges (user_email, badge_id, earned_at)
SELECT
  e.user_email,
  b.id,
  NOW()
FROM enrollments e
JOIN badges b ON b.name = 'Founding Member'
WHERE e.course_slug = 'ai-untuk-pemula-mastery'
  AND e.status = 'active'
ON CONFLICT (user_email, badge_id) DO NOTHING;
