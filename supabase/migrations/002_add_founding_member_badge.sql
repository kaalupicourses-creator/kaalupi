-- Migration: Tambah badge "Founding Member" untuk 100 orang pertama
-- yang enroll Mastery course. Run di Supabase SQL Editor.

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

-- Auto-grant Founding Member badge to anyone who has an active enrollment
-- on the Mastery course. Run this once, then re-run after large enrollment batches
-- (or trigger from /api/checkout when a paid mastery enrollment lands).
INSERT INTO user_badges (user_email, badge_id, awarded_at)
SELECT
  e.user_email,
  b.id,
  NOW()
FROM enrollments e
JOIN badges b ON b.name = 'Founding Member'
WHERE e.course_slug = 'ai-untuk-pemula-mastery'
  AND e.status = 'active'
ON CONFLICT (user_email, badge_id) DO NOTHING;
