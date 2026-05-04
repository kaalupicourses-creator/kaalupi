# Kaalupi Design Research & Analysis

## Platform yang Direview

### International Platforms
| Platform | Style | Key Design Elements |
|---|---|---|
| **Coursera** | Clean, academic | Hero besar dengan foto orang, card-based course grid, trust badges dari universitas |
| **Udemy** | Dense, marketplace | Hero search bar, rating stars di card, harga diskon, kategori pills, instructor photos |
| **Skillshare** | Creative, modern | Hero video/animasi, project showcase, instructor portraits, gradient accents |

### Indonesian Platforms
| Platform | Style | Key Design Elements |
|---|---|---|
| **Dicoding** | Technical, clean | Hero dengan ilustrasi, level badges, jam belajar counter, progress tracking UI |
| **BuildWithAngga** | Vibrant, modern | Hero gradient + ilustrasi, category tabs, roadmaps, student count, free classes section |

## Common Patterns yang Ditemukan

### 1. Hero Section
- **Hampir semua platform** pakai kombinasi: headline besar + subtext + CTA button + visual
- **Visual types**: foto orang belajar (Coursera), ilustrasi (Dicoding, BWA), animasi (Skillshare)
- **CTA**: 1 primary ( Explore / Mulai ) + 1 secondary (Login / Learn More)
- **Social proof**: student count, rating, partner logos

### 2. Course Cards
- **Standard elements**: Thumbnail image, title, category badge, level, rating stars, price, instructor
- **Hover effects**: lift, shadow, accent border
- **Meta info**: duration, lessons count, enrolled students

### 3. Trust & Social Proof
- Student enrollment numbers
- Star ratings
- Instructor credentials
- Partner/university logos
- Testimonials with avatar + role

### 4. Category / Track Navigation
- Category pills/tabs untuk filter
- Icon-based category cards
- Roadmap/career path visualization

## Rekomendasi untuk Kaalupi

### Ilustrasi & Gambar
**Source**: unDraw.co (free, open-source, customizable color)
- Open license, no attribution needed
- SVG format (scalable, lightweight)
- Color customizable to match Kaalupi brand (orange/yellow)

**Illustrations needed**:
1. **Hero section**: "Team collaboration" atau "Online learning" - menunjukkan orang belajar
2. **Why Kaalupi section**: Icon-based illustration untuk setiap value prop
3. **Empty states**: Illustration untuk "belum ada course" atau "belum enroll"
4. **Dashboard**: Illustration untuk welcome section

### Image/Thumbnail Strategy
**Option A: Unsplash API** (free, high-quality photos)
- `https://unsplash.com/s/photos/{keyword}` 
- Bisa pakai direct image URLs untuk course thumbnails
- Free for commercial use

**Option B: Placeholder gradients** (no API needed)
- Generate gradient patterns dengan CSS
- Combine dengan emoji/icon overlays
- Zero dependency, always works

**Option C: AI-generated** (future)
- Gunakan Midjourney/DALL-E untuk custom course thumbnails
- Lebih branded dan unique

### Design Improvements yang Disarankan

#### Landing Page
- Hero section: Tambah ilustrasi/visual di samping text (layout 2 kolom)
- Stats section: Tambah icon untuk setiap stat
- Course cards: Tambah thumbnail image
- Testimonials: Tambah avatar image
- Tambah "Trusted by" / partner logos section

#### Courses Page
- Course cards dengan thumbnail image
- Filter by category dengan icon
- Sort options (popular, newest, price)

#### Course Detail Page
- Hero image/thumbnail besar
- Instructor info section dengan avatar
- "What you'll learn" box dengan checkmarks
- Curriculum accordion (expandable modules)

#### Dashboard
- Welcome illustration
- Stats cards dengan icon
- Recent activity section
- Progress visualization

### Color & Typography
- **Primary gradient**: Orange (#f97316) → Yellow (#facc15) — sudah ada
- **Background**: Dark navy (#08111d) — sudah ada
- **Accent**: Emerald (#10b981) untuk success/check
- **Typography**: Sudah clean, perlu hierarchy yang lebih jelas

### Pertanyaan untuk User
1. Mau pake ilustrasi unDraw (SVG, customizable) atau foto Unsplash, atau kombinasi?
2. Mau course thumbnails pake foto real, gradient placeholder, atau custom design?
3. Prefer hero section tetap text-focused atau mau split dengan visual (ilustrasi/foto)?
4. Mau tambah section "Trusted by / Partner logos" di landing page?
5. Ada brand color lain selain orange/yellow yang mau dipake?
