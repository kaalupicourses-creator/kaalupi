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

-- Seed courses (from existing data.ts)
INSERT INTO courses (slug, title, category, level, duration, price, summary, hero, outcomes, modules, format, featured) VALUES
  ('fullstack-web-engineer', 'Fullstack Web Engineer', 'Programming', 'Intermediate', '16 minggu', 2490000, 'Belajar React, Next.js, API, database, auth, testing, dan deployment lewat project end-to-end.', 'Bangun aplikasi production-ready dengan kurikulum yang menutup gap dari frontend ke backend.', '{"Membangun aplikasi Next.js modern untuk Vercel", "Mendesain REST API dan auth flow role-based", "Menghubungkan database, payment, dan deployment pipeline"}', '{"React UI foundations", "Next.js App Router", "API design and validation", "Database modeling", "Auth and authorization", "Payments, testing, and deployment"}', 'blended', true),
  ('network-engineer-pro', 'Network Engineer Pro', 'Network Engineer', 'Beginner to Advanced', '14 minggu', 2190000, 'Dasar sampai praktik jaringan enterprise: IP planning, VLAN, routing, switching, dan observability.', 'Rancang, bangun, dan troubleshoot infrastruktur jaringan yang stabil dan scalable.', '{"Memahami dasar perangkat dan protokol jaringan", "Membuat simulasi lab untuk routing dan switching", "Menyiapkan monitoring dasar dan dokumentasi operasi"}', '{"OSI, TCP/IP, and subnetting", "VLAN and switching", "Static and dynamic routing", "Firewall basics", "Monitoring and troubleshooting"}', 'video', true),
  ('cyber-security-analyst', 'Cyber Security Analyst', 'Cyber Security', 'Intermediate', '12 minggu', 2790000, 'Belajar incident workflow, log analysis, web security, hardening, dan lab investigasi.', 'Masuk ke jalur blue team dengan pembahasan taktis yang dekat dengan kebutuhan industri.', '{"Memahami attack surface aplikasi dan jaringan", "Melakukan triage log dan investigasi dasar", "Membuat checklist hardening untuk sistem umum"}', '{"Security fundamentals", "Threat modeling", "Web and API security", "SOC workflow", "Reporting and remediation"}', 'blended', true),
  ('product-ui-designer', 'Product UI Designer', 'Designer', 'Beginner', '10 minggu', 1890000, 'Pelajari UI systems, wireframing, prototype, visual hierarchy, dan kolaborasi dengan developer.', 'Bangun portofolio UI yang rapi, usable, dan siap masuk proses pengembangan produk.', '{"Menyusun design brief dan user flows", "Membuat design system sederhana", "Melakukan handoff ke tim frontend"}', '{"Design principles", "Wireframing and flows", "Visual systems", "Interactive prototype", "Design to development handoff"}', 'article', false)
ON CONFLICT (slug) DO NOTHING;
