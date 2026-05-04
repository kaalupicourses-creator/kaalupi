-- Kaalupi Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL,
  hero TEXT NOT NULL,
  outcomes TEXT[] NOT NULL DEFAULT '{}',
  modules TEXT[] NOT NULL DEFAULT '{}',
  format TEXT NOT NULL CHECK (format IN ('video', 'article', 'blended')),
  is_free BOOLEAN NOT NULL DEFAULT false,
  is_lifetime_access BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  author_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_email, course_slug)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
  payment_type TEXT,
  midtrans_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  module_index INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_email, course_slug, module_index)
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  module_index INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  discount_amount INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  applicable_courses TEXT[] DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  required_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_email)
);

-- User badges (earned)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_email, badge_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_email, course_slug)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(featured);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_email);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_email, course_slug);
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course_slug);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_user_points_email ON user_points(user_email);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_email);
CREATE INDEX IF NOT EXISTS idx_certificates_user_course ON certificates(user_email, course_slug);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for new tables
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vouchers_updated_at BEFORE UPDATE ON vouchers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed badges
INSERT INTO badges (name, description, icon, required_points) VALUES
  ('Pemula', 'Menyelesaikan kursus pertama', '🎓', 0),
  ('Rajin Belajar', 'Mengumpulkan 100 poin', '📚', 100),
  ('Master', 'Menyelesaikan 3 kursus', '🏆', 500),
  ('Kontributor', 'Berbagi sertifikat di LinkedIn', '🔗', 50)
ON CONFLICT DO NOTHING;

-- Seed vouchers
INSERT INTO vouchers (code, discount_percent, max_uses, valid_until) VALUES
  ('KAA LUPI2026', 20, 100, NOW() + INTERVAL '6 months'),
  ('WELCOME50', 50, 50, NOW() + INTERVAL '3 months')
ON CONFLICT DO NOTHING;

-- Seed courses (6+ courses: 2 free fundamental, 4+ paid)
INSERT INTO courses (slug, title, category, level, duration, price, summary, hero, outcomes, modules, format, is_free, is_lifetime_access, featured) VALUES
  -- FREE FUNDAMENTAL COURSES
  ('ai-untuk-pemula', 'AI untuk Pemula — Dari Nol ke Produktif', 'Artificial Intelligence', 'Beginner', '7.5 jam', 0, 'Pelajari cara kerja AI, prompt engineering, dan cara pakai AI untuk produktivitas, karier, dan bisnis — dari nol, dalam bahasa Indonesia.', 'Mulai dari nol, pelajari cara kerja AI dan gunakan untuk produktivitas, karier, dan bisnis — tanpa background teknis.', '{"Memahami cara kerja AI dan model bahasa (LLM) secara konseptual", "Membuat prompt yang efektif untuk berbagai kebutuhan kerja", "Menggunakan AI tools populer untuk produktivitas sehari-hari"}', '{"Cara kerja AI & Large Language Models", "Prompt Engineering dasar hingga lanjutan", "AI untuk produktivitas dan pekerjaan", "AI untuk bisnis dan karier", "Tools AI populer & workflow praktis"}', 'video', true, true, true),

  ('dasar-pemrograman-web', 'Dasar Pemrograman Web', 'Programming', 'Beginner', '10 jam', 0, 'Pelajari fondasi HTML, CSS, dan JavaScript untuk memulai karier di web development.', 'Bangun fondasi kuat web development dengan materi praktis bahasa Indonesia.', '{"Menguasai struktur HTML dan semantic markup", "Membuat styling responsif dengan CSS modern", "Memahami dasar JavaScript untuk interaktivitas web"}', '{"HTML fundamentals", "CSS layout dan responsive design", "JavaScript dasar dan DOM manipulation", "Mini project landing page"}', 'blended', true, true, true),

  -- PAID COURSES
  ('fullstack-web-engineer', 'Fullstack Web Engineer', 'Programming', 'Intermediate', '16 minggu', 2490000, 'Belajar React, Next.js, API, database, auth, testing, dan deployment lewat project end-to-end.', 'Bangun aplikasi production-ready dengan kurikulum yang menutup gap dari frontend ke backend.', '{"Membangun aplikasi Next.js modern untuk Vercel", "Mendesain REST API dan auth flow role-based", "Menghubungkan database, payment, dan deployment pipeline"}', '{"React UI foundations", "Next.js App Router", "API design and validation", "Database modeling", "Auth and authorization", "Payments, testing, and deployment"}', 'blended', false, true, true),

  ('network-engineer-pro', 'Network Engineer Pro', 'Network Engineer', 'Beginner to Advanced', '14 minggu', 2190000, 'Dasar sampai praktik jaringan enterprise: IP planning, VLAN, routing, switching, dan observability.', 'Rancang, bangun, dan troubleshoot infrastruktur jaringan yang stabil dan scalable.', '{"Memahami dasar perangkat dan protokol jaringan", "Membuat simulasi lab untuk routing dan switching", "Menyiapkan monitoring dasar dan dokumentasi operasi"}', '{"OSI, TCP/IP, and subnetting", "VLAN and switching", "Static and dynamic routing", "Firewall basics", "Monitoring and troubleshooting"}', 'video', false, true, true),

  ('cyber-security-analyst', 'Cyber Security Analyst', 'Cyber Security', 'Intermediate', '12 minggu', 2790000, 'Belajar incident workflow, log analysis, web security, hardening, dan lab investigasi.', 'Masuk ke jalur blue team dengan pembahasan taktis yang dekat dengan kebutuhan industri.', '{"Memahami attack surface aplikasi dan jaringan", "Melakukan triage log dan investigasi dasar", "Membuat checklist hardening untuk sistem umum"}', '{"Security fundamentals", "Threat modeling", "Web and API security", "SOC workflow", "Reporting and remediation"}', 'blended', false, true, true),

  ('product-ui-designer', 'Product UI Designer', 'Designer', 'Beginner', '10 minggu', 1890000, 'Pelajari UI systems, wireframing, prototype, visual hierarchy, dan kolaborasi dengan developer.', 'Bangun portofolio UI yang rapi, usable, dan siap masuk proses pengembangan produk.', '{"Menyusun design brief dan user flows", "Membuat design system sederhana", "Melakukan handoff ke tim frontend"}', '{"Design principles", "Wireframing and flows", "Visual systems", "Interactive prototype", "Design to development handoff"}', 'article', false, true, false),

  ('data-science-fundamental', 'Data Science Fundamental', 'Data Science', 'Beginner', '12 minggu', 1990000, 'Pelajari dasar data science: Python, pandas, visualisasi data, dan machine learning introduction.', 'Mulai karier data science dengan kurikulum praktis dan project nyata.', '{"Memahami workflow data science dari cleaning hingga visualization", "Menggunakan Python untuk analisis data", "Membuat dashboard visualisasi data sederhana"}', '{"Python for Data Science", "Data Cleaning dan Preprocessing", "Exploratory Data Analysis", "Introduction to Machine Learning", "Data Visualization dengan Matplotlib"}', 'video', false, true, true)
ON CONFLICT (slug) DO NOTHING;
