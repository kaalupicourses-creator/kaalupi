export type UserRole = "admin" | "instructor" | "student";

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  summary: string;
  hero: string;
  outcomes: string[];
  modules: string[];
  format: "video" | "article" | "blended";
  featured?: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string[];
};

export type DemoUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const siteConfig = {
  name: "Kaalupi",
  description:
    "Platform course IT profesional untuk belajar programming, network engineering, cyber security, dan design dengan jalur belajar yang jelas.",
  phone: "+62 812-8800-1122",
  email: "hello@kaalupi.id",
  address: "Jakarta, Indonesia",
};

export const demoUsers: DemoUser[] = [
  {
    name: "Raka Putra",
    email: "admin@kaalupi.dev",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Nadia Prameswari",
    email: "mentor@kaalupi.dev",
    password: "mentor123",
    role: "instructor",
  },
  {
    name: "Dimas Akbar",
    email: "student@kaalupi.dev",
    password: "student123",
    role: "student",
  },
];

export const stats = [
  { label: "Active learners", value: "12.4K+" },
  { label: "Expert instructors", value: "80+" },
  { label: "Course packages", value: "40+" },
  { label: "Completion rate", value: "91%" },
];

export const valueProps = [
  "Learning path per role: beginner sampai specialist.",
  "Blended delivery: video, artikel, lab, dan project review.",
  "Dashboard admin, instructor, dan student dengan privilege terpisah.",
  "Payment flow siap dihubungkan ke Midtrans untuk pembelian real.",
];

export const audienceTracks = [
  {
    title: "Programming Engineer",
    description:
      "Frontend, backend, fullstack, API design, deployment, testing, dan system design.",
  },
  {
    title: "Network Engineer",
    description:
      "Routing, switching, monitoring, security hardening, troubleshooting, dan enterprise topology.",
  },
  {
    title: "Cyber Security",
    description:
      "SOC fundamentals, web security, threat modeling, blue team workflow, dan pentest lab.",
  },
  {
    title: "Creative Designer",
    description:
      "UI design, design systems, prototyping, product thinking, dan handoff workflow ke developer.",
  },
];

export const courses: Course[] = [
  {
    slug: "fullstack-web-engineer",
    title: "Fullstack Web Engineer",
    category: "Programming",
    level: "Intermediate",
    duration: "16 minggu",
    price: 2490000,
    summary:
      "Belajar React, Next.js, API, database, auth, testing, dan deployment lewat project end-to-end.",
    hero:
      "Bangun aplikasi production-ready dengan kurikulum yang menutup gap dari frontend ke backend.",
    outcomes: [
      "Membangun aplikasi Next.js modern untuk Vercel",
      "Mendesain REST API dan auth flow role-based",
      "Menghubungkan database, payment, dan deployment pipeline",
    ],
    modules: [
      "React UI foundations",
      "Next.js App Router",
      "API design and validation",
      "Database modeling",
      "Auth and authorization",
      "Payments, testing, and deployment",
    ],
    format: "blended",
    featured: true,
  },
  {
    slug: "network-engineer-pro",
    title: "Network Engineer Pro",
    category: "Network Engineer",
    level: "Beginner to Advanced",
    duration: "14 minggu",
    price: 2190000,
    summary:
      "Dasar sampai praktik jaringan enterprise: IP planning, VLAN, routing, switching, dan observability.",
    hero:
      "Rancang, bangun, dan troubleshoot infrastruktur jaringan yang stabil dan scalable.",
    outcomes: [
      "Memahami dasar perangkat dan protokol jaringan",
      "Membuat simulasi lab untuk routing dan switching",
      "Menyiapkan monitoring dasar dan dokumentasi operasi",
    ],
    modules: [
      "OSI, TCP/IP, and subnetting",
      "VLAN and switching",
      "Static and dynamic routing",
      "Firewall basics",
      "Monitoring and troubleshooting",
    ],
    format: "video",
    featured: true,
  },
  {
    slug: "cyber-security-analyst",
    title: "Cyber Security Analyst",
    category: "Cyber Security",
    level: "Intermediate",
    duration: "12 minggu",
    price: 2790000,
    summary:
      "Belajar incident workflow, log analysis, web security, hardening, dan lab investigasi.",
    hero:
      "Masuk ke jalur blue team dengan pembahasan taktis yang dekat dengan kebutuhan industri.",
    outcomes: [
      "Memahami attack surface aplikasi dan jaringan",
      "Melakukan triage log dan investigasi dasar",
      "Membuat checklist hardening untuk sistem umum",
    ],
    modules: [
      "Security fundamentals",
      "Threat modeling",
      "Web and API security",
      "SOC workflow",
      "Reporting and remediation",
    ],
    format: "blended",
    featured: true,
  },
  {
    slug: "product-ui-designer",
    title: "Product UI Designer",
    category: "Designer",
    level: "Beginner",
    duration: "10 minggu",
    price: 1890000,
    summary:
      "Pelajari UI systems, wireframing, prototype, visual hierarchy, dan kolaborasi dengan developer.",
    hero:
      "Bangun portofolio UI yang rapi, usable, dan siap masuk proses pengembangan produk.",
    outcomes: [
      "Menyusun design brief dan user flows",
      "Membuat design system sederhana",
      "Melakukan handoff ke tim frontend",
    ],
    modules: [
      "Design principles",
      "Wireframing and flows",
      "Visual systems",
      "Interactive prototype",
      "Design to development handoff",
    ],
    format: "article",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "cara-memilih-course-it-yang-benar",
    title: "Cara Memilih Course IT yang Benar Buat Naik Level Karier",
    category: "Career",
    date: "2026-04-16",
    excerpt:
      "Framework sederhana untuk menilai course berdasarkan outcome, mentor, proyek, dan support setelah belajar.",
    content: [
      "Course yang bagus tidak dimulai dari daftar tools, tapi dari outcome yang ingin dicapai. Kalau targetmu pindah karier, maka kebutuhanmu berbeda dengan engineer yang ingin naik ke level senior.",
      "Perhatikan apakah materi punya urutan yang jelas, proyek yang cukup realistis, dan penilaian yang bisa menunjukkan bahwa kamu benar-benar paham, bukan cuma menonton video.",
      "Mentor yang kuat biasanya tidak hanya mengajar fitur, tapi mengajarkan judgement: kapan suatu pendekatan dipakai, tradeoff-nya apa, dan di kondisi apa solusi itu gagal.",
    ],
  },
  {
    slug: "belajar-nextjs-untuk-project-production",
    title: "Belajar Next.js untuk Project Production, Bukan Cuma Demo",
    category: "Programming",
    date: "2026-03-22",
    excerpt:
      "Hal-hal yang wajib dipahami sebelum membawa project Next.js ke production: data flow, auth, cache, dan deployment.",
    content: [
      "Banyak tutorial berhenti di tampilan. Di production, tantangan justru ada di data lifecycle, otorisasi, observability, dan integrasi pihak ketiga seperti payment atau email.",
      "Karena itu, latihan terbaik adalah membuat project yang benar-benar punya alur bisnis lengkap: landing page, login, dashboard, checkout, dan proteksi akses materi.",
      "Kalau stack dan struktur file sejak awal rapi, scaling fitur akan jauh lebih mudah dibanding harus membongkar total ketika project mulai dipakai user.",
    ],
  },
  {
    slug: "kenapa-skill-networking-masih-sangat-dibutuhkan",
    title: "Kenapa Skill Networking Masih Sangat Dibutuhkan di 2026",
    category: "Network Engineer",
    date: "2026-02-10",
    excerpt:
      "Cloud tidak menghapus kebutuhan networking. Justru ia menuntut engineer yang paham konektivitas, visibility, dan keamanan.",
    content: [
      "Setiap sistem tetap bergantung pada konektivitas. Entah workload berjalan di kantor, data center, atau cloud, engineer tetap butuh mental model jaringan yang kuat.",
      "Masalah performa, packet loss, misconfiguration, dan access control tidak hilang ketika stack makin modern. Yang berubah hanya tools dan tempat kejadiannya.",
      "Itulah kenapa course networking modern harus membahas praktik operasi nyata, bukan hanya teori protokol.",
    ],
  },
];

export const testimonials = [
  {
    name: "Aisyah",
    role: "Junior Frontend Engineer",
    quote:
      "Materinya runtut dan ngga berhenti di teori. Project review-nya ngebantu banget pas transisi ke kerjaan real.",
  },
  {
    name: "Bagas",
    role: "Network Support",
    quote:
      "Track network engineer di Kaalupi ngebuat saya ngerti topologi, troubleshooting, dan dokumentasi dengan cara yang jauh lebih praktis.",
  },
  {
    name: "Kevin",
    role: "Security Enthusiast",
    quote:
      "Yang saya suka: pembelajaran security-nya bukan sensasional, tapi rapi dan operasional.",
  },
];
