export type UserRole = "super_admin" | "admin" | "instructor" | "student";

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  original_price?: number; // harga asli sebelum diskon early bird
  summary: string;
  hero: string;
  outcomes: string[];
  modules: string[];
  format: "video" | "article" | "blended";
  featured?: boolean;
  comingSoon?: boolean;
  is_free?: boolean;
  is_lifetime_access?: boolean;
  is_published?: boolean;
  // Founding Members tier
  founding_members_limit?: number; // total slot early bird (e.g., 100)
  founding_price?: number; // harga early bird
  regular_price?: number; // harga setelah quota habis
  free_modules_count?: number; // first N modules free, rest need paid enrollment
  perks?: string[]; // bullet point perks (Discord, AI Tutor, dll)
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
    "Platform course IT profesional untuk belajar AI, programming, network engineering, dan cyber security — dalam bahasa Indonesia, langsung praktik.",
  phone: "+62 819-3004-5321",
  email: "kaalupicourses@gmail.com",
  address: "Bogor, Indonesia",
  community: {
    discord: "https://discord.gg/hKbnPpVr",
    whatsapp: "https://chat.whatsapp.com/GFEmZeqQZ901xQQwobzyHl",
    instagram: "https://www.instagram.com/kaalupicourses/",
    youtube: "https://www.youtube.com/@Kaalupi-r9j",
  },
  // Manual payment — admin verifies via WhatsApp + dashboard
  // Update di sini kalau ada perubahan rekening / no admin
  payment: {
    // Nomor admin yang nerima bukti bayar (TANPA + atau spasi)
    // 081293988757 → 6281293988757
    adminWhatsapp: "6281293988757",
    methods: [
      {
        id: "dana",
        name: "DANA",
        type: "ewallet",
        accountName: "KAMIL ALFARIS",
        accountNumber: "081293988757",
        instructions:
          "Buka DANA → Kirim → masukin nomor di atas → masukin nominal yang sama persis → kirim.",
      },
      {
        id: "bca",
        name: "BCA",
        type: "bank",
        accountName: "Kamil Alfaris",
        accountNumber: "6831297252",
        instructions:
          "Transfer via mobile banking / internet banking / ATM BCA. Pakai nominal yang sama persis. Catatan: 683-129-7252.",
      },
      {
        id: "bsi",
        name: "BSI (Bank Syariah Indonesia)",
        type: "bank",
        accountName: "Faris",
        accountNumber: "7220402937",
        instructions:
          "Transfer via BSI Mobile / internet banking / ATM BSI. Nominal harus sama persis.",
      },
    ] as PaymentMethod[],
  },
};

export type PaymentMethod = {
  id: "dana" | "bca" | "bsi";
  name: string;
  type: "ewallet" | "bank";
  accountName: string;
  accountNumber: string;
  instructions: string;
  qrImage?: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  illustration: {
    bg: string;
    accent: string;
    shape: "blob" | "wave" | "lattice" | "burst";
  };
};

export const founders: Founder[] = [
  {
    name: "Kamil Alfaris",
    role: "AI & Platform",
    bio: "Pegang AI engineering, automation, dan integrasi platform Kaalupi end-to-end.",
    skills: ["AI Engineering", "Fullstack", "Cyber", "Design"],
    illustration: { bg: "#F5A62A", accent: "#FFF3D6", shape: "blob" },
  },
  {
    name: "Akbar Rizki Pratama",
    role: "Brand & Media",
    bio: "Anak Media. Pegang visual, video, dan storytelling — bikin Kaalupi keliatan profesional tapi tetap manusiawi.",
    skills: ["Video", "Visual", "Brand", "Story"],
    illustration: { bg: "#7AB648", accent: "#E8F5E9", shape: "wave" },
  },
  {
    name: "Raden Muhammad Fadhel Suradipraja",
    role: "Engineering",
    bio: "Anak Programming. Backbone teknis platform — fitur baru, automation, dan integrasi sistem belajar.",
    skills: ["Backend", "API", "DevOps", "Frontend"],
    illustration: { bg: "#2D5016", accent: "#F0E8D8", shape: "lattice" },
  },
  {
    name: "Lutfi Hakim Atharie",
    role: "Network & Cyber",
    bio: "Anak Network Engineer. Akan jadi instruktur utama track Network Engineer & Cyber Security yang akan rilis.",
    skills: ["Network", "Cyber", "Infra", "Security"],
    illustration: { bg: "#5C4813", accent: "#FFF3D6", shape: "burst" },
  },
];

export const demoUsers: DemoUser[] = [];

export const stats = [
  { label: "Founding Members", value: "100", suffix: "slot" },
  { label: "Mulai Belajar", value: "Gratis", suffix: "" },
  { label: "Akses", value: "Lifetime", suffix: "" },
  { label: "Bahasa", value: "Indonesia", suffix: "" },
];

export const valueProps = [
  "Learning path per role: beginner sampai specialist.",
  "Blended delivery: video, artikel, lab, dan project review.",
  "Dashboard admin, instructor, dan student dengan privilege terpisah.",
  "Founding Members: 100 slot pertama dapet lifetime access ke SEMUA course Kaalupi.",
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
  // ─── WEB DEVELOPMENT (Fairus) — FLAGSHIP ──────────────────────────────────
  // NOTE: slug tetap "cyber-security-pemula" biar checkout, enrollment, & counter
  // founding yang udah kepasang ga rusak. Kontennya di-reskin jadi Web Dev.
  {
    slug: "cyber-security-pemula",
    title: "The Smart Vibe Coder — Kuasai Web Dev Bareng AI",
    category: "Web Development",
    level: "Beginner",
    duration: "Self-paced",
    price: 199000,
    original_price: 499000,
    founding_members_limit: 100,
    founding_price: 199000,
    regular_price: 499000,
    summary:
      "Belajar web development dari nol di era AI. Bukan cuma modal prompting — lu bakal ngerti fondasinya biar bisa NGONTROL AI, bukan dikontrol. Dari setup, HTML/CSS/JS, prompt engineering, sampai bangun web pertama + challenge ala real project.",
    hero:
      "Bukan cuma nyuruh AI bikin kode — lu bakal paham fondasinya, tau kapan harus intervensi pas AI ngaco, dan bisa bangun web beneran dari nol. Dari Vibe Coder pemula menuju Full-Stack Engineer.",
    outcomes: [
      "Ngerti bedanya developer yang ngontrol AI vs yang dikontrol AI",
      "Kuasai fondasi HTML, CSS & JavaScript biar ga asal tempel kode AI",
      "Setup environment modern (VS Code / Cursor) buat kolaborasi sama AI",
      "Teknik prompt engineering buat generate, debug, dan refactor kode",
      "Bangun web pertama lu dari nol dengan bantuan AI",
      "Debugging kode AI yang error secara mandiri",
      "Punya project yang layak masuk portofolio buat recruiter",
    ],
    modules: [
      "Pengenalan & Mindset Vibe Coding",
      "Setup Lab: Optimasi Editor & AI",
      "Fondasi Web: HTML, CSS & JavaScript",
      "Prompt Engineering untuk Developer",
      "Studi Kasus: Bangun Web Pertama",
      "Career & Next Step",
      "BONUS — Vibe Coding Challenge",
    ],
    format: "blended",
    featured: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
    perks: [
      "7 modul: video + artikel + Vibe Coding Challenge (lab praktik)",
      "Lifetime access ke SEMUA course Kaalupi (sekarang & yang akan rilis)",
      "Sertifikat resmi Kaalupi (PDF + LinkedIn share)",
      "AI Tutor 24/7 — tanya apa aja per modul",
      "Akses Discord komunitas Founding Members",
      "Badge Founding Member eksklusif & permanen di profil",
      "Update materi gratis selamanya",
    ],
  },

  // ─── NETWORK ENGINEERING (Agoy) ──────────────────────────────────────────
  // Materi lagi disiapin instructor. comingSoon = tampil tapi belum bisa dibeli.
  {
    slug: "jncia-juniper",
    title: "JNCIA — Juniper Network Associate dari Nol",
    category: "Network Engineering",
    level: "Beginner",
    duration: "Self-paced",
    price: 199000,
    original_price: 499000,
    founding_members_limit: 100,
    founding_price: 199000,
    regular_price: 499000,
    summary:
      "Persiapan sertifikasi JNCIA-Junos dari nol. Fondasi jaringan, Junos OS, konfigurasi, monitoring, sampai routing — langsung praktik biar siap ambil sertifikat.",
    hero:
      "Buka pintu karier network engineer lewat sertifikasi Juniper. Belajar Junos OS dari dasar sampai pede ngonfig & lulus ujian JNCIA.",
    outcomes: [
      "Paham fondasi jaringan & model OSI/TCP-IP",
      "Kuasai dasar Junos OS & CLI Juniper",
      "Konfigurasi interface, routing, & firewall filter",
      "Monitoring & maintenance perangkat Juniper",
      "Siap ambil ujian sertifikasi JNCIA-Junos",
    ],
    modules: [
      "Networking Fundamentals",
      "Junos OS Fundamentals",
      "User Interface & Konfigurasi Dasar",
      "Operational Monitoring & Maintenance",
      "Routing Fundamentals",
      "Routing Policy & Firewall Filters",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },

  {
    slug: "ccnp-cisco",
    title: "CCNP — Cisco Network Professional",
    category: "Network Engineering",
    level: "Intermediate to Advanced",
    duration: "Self-paced",
    price: 299000,
    original_price: 699000,
    founding_members_limit: 100,
    founding_price: 299000,
    regular_price: 699000,
    summary:
      "Naik level ke CCNP. Advanced routing (OSPF, EIGRP, BGP), switching & security enterprise, otomasi, sampai troubleshooting jaringan skala besar.",
    hero:
      "Level profesional buat network engineer. Dari advanced routing sampai troubleshooting enterprise — skill yang dicari perusahaan gede.",
    outcomes: [
      "Kuasai advanced routing: OSPF, EIGRP, BGP",
      "Konfigurasi switching & security enterprise",
      "Dasar network automation",
      "Troubleshoot jaringan skala enterprise",
      "Siap ambil sertifikasi CCNP",
    ],
    modules: [
      "Advanced Routing & Enterprise Networking",
      "Switching, Security & Automation",
      "Troubleshooting & Enterprise Services",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },

  // ─── DESIGN (Akbar) ───────────────────────────────────────────────────────
  {
    slug: "product-ui-design",
    title: "UI Design for Beginners — From Zero to Portfolio",
    category: "Design",
    level: "Beginner",
    duration: "Self-paced",
    price: 199000,
    original_price: 499000,
    founding_members_limit: 100,
    founding_price: 199000,
    regular_price: 499000,
    summary:
      "Belajar UI design dari benar-benar nol pakai Figma. Dari fondasi desain, mastering Figma, design system, sampai bikin 3 project nyata (landing page, mobile app, dashboard) buat portofolio lu.",
    hero:
      "Ga perlu bakat gambar. Belajar UI design step by step pakai Figma — dari nol sampai punya 3 project portofolio yang siap dipamerin ke recruiter.",
    outcomes: [
      "Ngerti dasar UI design & cara berpikir desainer",
      "Mastering Figma dari nol sampai mahir",
      "Kuasai fondasi desain: warna, tipografi, hierarki, grid",
      "Bikin design system & komponen reusable",
      "Selesaikan 3 project: landing page, mobile app, dashboard",
      "Punya portofolio UI yang siap dipamerin",
    ],
    modules: [
      "Introduction to UI Design",
      "Mastering Figma",
      "UI Design Fundamentals",
      "Design System & Figma Workflow",
      "Project 1: Landing Page Design",
      "Project 2: Mobile App Design",
      "Project 3: Dashboard & Prototype",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },

  // ─── GRAPHIC DESIGN (Fatir) ───────────────────────────────────────────────
  {
    slug: "graphic-design",
    title: "Graphic Design — Dari Nol ke Portofolio",
    category: "Design",
    level: "Beginner",
    duration: "Self-paced",
    price: 199000,
    original_price: 499000,
    founding_members_limit: 100,
    founding_price: 199000,
    regular_price: 499000,
    summary:
      "Belajar desain grafis dari nol: prinsip desain, tipografi, warna, tools, sampai bikin karya yang layak masuk portofolio. Cocok buat pemula yang mau serius di dunia desain.",
    hero:
      "Dari nol sampai bisa bikin desain yang keliatan profesional. Pelajari fondasi, tools, dan praktik langsung sampai punya portofolio pertama lu.",
    outcomes: [
      "Paham prinsip dasar desain grafis",
      "Kuasai tipografi & teori warna",
      "Lancar pakai tools desain profesional",
      "Bikin desain yang konsisten & enak dilihat",
      "Punya portofolio desain grafis pertama lu",
    ],
    modules: [
      "Pengenalan Desain Grafis & Mindset Desainer",
      "Prinsip Dasar Desain",
      "Tipografi",
      "Teori Warna",
      "Tools & Workflow Desain",
      "Praktik: Bikin Karya Desain",
      "Final Project & Portofolio",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },

  // ─── AKADEMIK (pelajaran umum — buat pasar non-IT) ────────────────────────
  {
    slug: "bahasa-inggris-praktis",
    title: "Bahasa Inggris Praktis — Buat Sekolah, Kuliah & Kerja",
    category: "Akademik",
    level: "Beginner",
    duration: "Self-paced",
    price: 149000,
    original_price: 299000,
    founding_members_limit: 100,
    founding_price: 149000,
    regular_price: 299000,
    summary:
      "Bahasa Inggris yang kepake beneran — bukan ngapalin grammar doang. Dari dasar sampai pede ngomong & nulis buat sekolah, kuliah, dan kerja.",
    hero:
      "Berhenti takut salah grammar. Belajar Inggris yang praktis, langsung bisa dipake ngobrol, nulis, dan lulus tes.",
    outcomes: [
      "Grammar dasar yang bener tanpa pusing",
      "Vocabulary yang kepake sehari-hari",
      "Pede speaking tanpa takut salah",
      "Nulis email & essay yang rapi",
      "Persiapan tes (TOEFL / interview kerja)",
    ],
    modules: [
      "Grammar Dasar yang Ga Bikin Pusing",
      "Vocabulary Sehari-hari",
      "Speaking dengan Pede",
      "Writing: Email & Essay",
      "Persiapan Tes & Interview",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },

  {
    slug: "matematika-jago",
    title: "Matematika — Dari Bingung Jadi Jago",
    category: "Akademik",
    level: "Beginner",
    duration: "Self-paced",
    price: 149000,
    original_price: 299000,
    founding_members_limit: 100,
    founding_price: 149000,
    regular_price: 299000,
    summary:
      "Matematika yang dijelasin sampe ngerti, bukan cuma ngapalin rumus. Dari aljabar dasar sampai trigonometri, plus tips ngerjain soal dengan cepet.",
    hero:
      "Matematika bukan bakat — cuma butuh cara jelasin yang bener. Dari bingung jadi jago, satu topik demi satu topik.",
    outcomes: [
      "Paham konsep, bukan cuma ngapalin rumus",
      "Aljabar dasar sampai lancar",
      "Geometri & trigonometri yang jelas",
      "Pengenalan kalkulus buat yang mau lanjut",
      "Tips & trik ngerjain soal dengan cepet",
    ],
    modules: [
      "Aljabar Dasar",
      "Geometri",
      "Trigonometri",
      "Pengenalan Kalkulus",
      "Strategi Ngerjain Soal Cepat",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
  },
];

export const comingSoonTracks = [
  {
    title: "App Developer",
    description: "Bangun aplikasi mobile dari nol: dasar mobile dev, UI, state management, sampai publish ke store.",
  },
  {
    title: "Data Science Fundamental",
    description: "Pelajari dasar data science: Python, pandas, visualisasi data, dan machine learning introduction.",
  },
  {
    title: "AI Specialist Track",
    description: "Lanjutkan belajar AI: computer vision, NLP, dan deployment model AI untuk production.",
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
   {
     slug: "prompt-engineering-dasar-ai",
     title: "Prompt Engineering Dasar: Cara Berkomunikasi dengan AI yang Efektif",
     category: "AI",
     date: "2026-05-01",
     excerpt:
       "Pelajari teknik dasar prompt engineering untuk mendapatkan hasil optimal dari AI tools seperti ChatGPT dan Claude.",
     content: [
       "Prompt engineering adalah seni merangkai instruksi yang tepat agar AI memahami konteks dan memberikan output yang diinginkan. Hal ini krusial di era AI seperti sekarang.",
       "Teknik dasar seperti memberikan konteks, menentukan role, dan memberikan contoh (few-shot prompting) bisa meningkatkan kualitas respons AI secara signifikan.",
       "Praktikkan dengan berbagai skenario kerja: penulisan email, debugging kode, analisis data, hingga pembuatan konten kreatif. Semakin sering dipraktikkan, semakin paham polanya.",
     ],
   },
   {
     slug: "keamanan-siber-untuk-pemula",
     title: "Keamanan Siber untuk Pemula: Lindungi Data Pribadi dan Bisnis",
     category: "Cyber Security",
     date: "2026-04-28",
     excerpt:
       "Memahami konsep dasar keamanan siber dan langkah praktis untuk melindungi aset digital Anda.",
     content: [
       "Keamanan siber bukan cuma tentang antivirus atau firewall. Ini adalah mindset dan praktik berlapis yang dimulai dari pemahaman ancaman hingga implementasi kontrol keamanan.",
       "Prinsip dasar seperti least privilege, defense in depth, dan zero trust mulai banyak diterapkan bahkan di startup kecil. Pahami dulu konsepnya sebelum masuk ke tools.",
       "Langkah awal yang sering diremekan: gunakan password manager, aktifkan 2FA di semua akun, update software secara rutin, dan waspada terhadap phishing.",
     ],
   },
   {
     slug: "ui-ux-design-trends-2026",
     title: "UI/UX Design Trends 2026: Yang Perlu Kamu Tahu",
     category: "Designer",
     date: "2026-04-25",
     excerpt:
       "Tren desain antarmuka dan pengalaman pengguna yang mendominasi industri di tahun 2026.",
     content: [
       "Tahun 2026 menandai pergeseran ke arah desain yang lebih personal, kontekstual, dan mengutamakan aksesibilitas. AI juga mulai membantu dalam pembuatan wireframe dan prototipe.",
       "Desain sistem (design system) makin penting karena tim produk butuh konsistensi antar platform. Komponen yang bisa digunakan ulang (reusable) menghemat waktu development.",
       "Fokus pada micro-interactions, dark mode yang nyaman di mata, dan performa desain di perangkat mobile. User semakin kritis terhadap kecepatan dan kenyamanan visual.",
     ],
   },
   {
     slug: "python-untuk-data-science",
     title: "Python untuk Data Science: Mulai dari Mana?",
     category: "Programming",
     date: "2026-04-20",
     excerpt:
       "Panduan lengkap memulai journey di data science dengan Python, library yang perlu dikuasai, dan project pertama Anda.",
     content: [
       "Python menjadi bahasa utama di data science karena sintaksnya yang bersih dan ekosistem library yang matang. Mulailah dengan memahami dasar-dasar Python sebelum masuk ke library spesifik.",
       "Library esensial seperti NumPy untuk komputasi numerik, Pandas untuk manipulasi data, Matplotlib/Seaborn untuk visualisasi, dan Scikit-learn untuk machine learning dasar.",
       "Project pertama yang ideal: analisis dataset publik (seperti data COVID-19 atau e-commerce), lakukan cleaning data, eksplorasi, visualisasi, dan tarik insight sederhana.",
     ],
   },
   {
     slug: "cloud-computing-aws-beginner",
     title: "Cloud Computing dengan AWS: Panduan Pemula",
     category: "Network Engineer",
     date: "2026-04-15",
     excerpt:
       "Memahami konsep dasar cloud computing dan cara memulai dengan Amazon Web Services (AWS).",
     content: [
       "Cloud computing memungkinkan kita menyewa sumber daya komputasi sesuai kebutuhan, tanpa harus membeli dan merawat server fisik. AWS adalah penyedia cloud terbesar saat ini.",
       "Mulailah dengan memahami layanan dasar: EC2 (virtual server), S3 (penyimpanan objek), RDS (database terkelola), dan VPC (jaringan privat). Pahami juga model pricing agar tidak kena tagihan mahal.",
       "Buatlah project sederhana seperti hosting website statis di S3, atau deploy aplikasi web sederhana di EC2. Praktik langsung adalah cara terbaik untuk belajar cloud.",
     ],
   },
   {
     slug: "tips-sukses-belajar-online",
     title: "5 Tips Sukses Belajar Online agar Tidak Mudah Menyerah",
     category: "Career",
     date: "2026-04-10",
     excerpt:
       "Strategi efektif untuk menjaga motivasi dan produktivitas saat belajar secara online.",
     content: [
       "Belajar online butuh disiplin tinggi karena tidak ada yang mengawasi langsung. Atur jadwal belajar yang konsisten, buat target harian, dan ciptakan lingkungan belajar yang kondusif.",
       "Gunakan teknik Pomodoro (25 menit fokus, 5 menit istirahat) untuk menjaga konsentrasi. Hindari multitasking dan matikan notifikasi media sosial saat sedang sesi belajar.",
       "Bergabunglah dengan komunitas atau study group untuk saling memotivasi. Diskusi dengan orang lain yang sedang belajar topik yang sama bisa memperdalam pemahaman.",
     ],
   },
   {
     slug: "git-github-colaboration",
     title: "Git & GitHub untuk Kolaborasi Tim: Wajib Dikuasai Developer",
     category: "Programming",
     date: "2026-04-05",
     excerpt:
       "Memahami workflow Git dan GitHub untuk bekerja dalam tim pengembangan software.",
     content: [
       "Version control dengan Git adalah skill wajib bagi developer modern. GitHub menjadi platform utama untuk kolaborasi, review code, dan manajemen project software.",
       "Pahami konsep branch, commit, merge, dan resolve conflict. Workflow seperti Git Flow atau GitHub Flow membantu tim bekerja secara paralel tanpa saling menimpa kode.",
       "Biasakan membuat commit message yang jelas dan deskriptif. Gunakan fitur Pull Request untuk code review sebelum kode digabung ke branch utama.",
     ],
   },
   {
     slug: "membangun-portofolio-it",
     title: "Membangun Portofolio IT yang Menarik Perhatian Recruiter",
     category: "Career",
     date: "2026-03-30",
     excerpt:
       "Cara menyusun portofolio yang menonjolkan skill dan project nyata untuk melamar kerja di bidang IT.",
     content: [
       "Portofolio adalah bukti nyata kemampuan Anda, lebih berharga dari sekadar daftar skill di CV. Pastikan setiap project di portofolio memiliki penjelasan yang jelas tentang teknologi dan tantangan yang dihadapi.",
       "Sertakan link ke repository GitHub, demo live, dan dokumentasi singkat. Tunjukkan proses berpikir Anda dalam menyelesaikan masalah, bukan cuma hasil akhirnya.",
       "Mulailah dari project kecil yang selesai, daripada project besar yang setengah jadi. Kualitas dan kelengkapan dokumentasi jauh lebih penting dari sekadar jumlah project.",
     ],
   },
   {
     slug: "docker-containerization-basics",
     title: "Docker & Containerization: Memahami Konsep Dasarnya",
     category: "Programming",
     date: "2026-03-25",
     excerpt:
       "Pengenalan Docker dan bagaimana containerization mengubah cara kita develop dan deploy aplikasi.",
     content: [
       "Docker memungkinkan aplikasi dan semua dependensinya dikemas dalam container yang bisa berjalan konsisten di berbagai environment. Ini mengatasi masalah 'works on my machine'.",
       "Pahami konsep image vs container, Dockerfile, docker-compose untuk multi-service app, dan Docker Hub sebagai registry. Praktikkan dengan containerisasi aplikasi web sederhana.",
       "Container menjadi standar di deployment modern, terutama saat digabung dengan orchestration tools seperti Kubernetes. Memahami Docker adalah fondasi untuk belajar Kubernetes nantinya.",
     ],
   },
   {
     slug: "soft-skills-developer",
     title: "Soft Skills yang Wajib Dimiliki Software Developer",
     category: "Career",
     date: "2026-03-18",
     excerpt:
       "Selain teknis, soft skills seperti komunikasi dan manajemen waktu krusial untuk kesuksesan karier developer.",
     content: [
       "Kemampuan teknis saja tidak cukup untuk sukses di industri IT. Soft skills seperti komunikasi efektif, kerja sama tim, dan problem-solving mindset sama pentingnya.",
       "Belajarlah menyampaikan ide teknis ke orang non-teknis dengan bahasa yang mudah dimengerti. Kemampuan ini sangat berharga saat melapor ke manajemen atau berdiskusi dengan klien.",
       "Time management dan kemampuan memprioritaskan tugas juga krusial. Developer sering dihadapkan pada banyak task dengan deadline ketat, kemampuan mengatur diri sangat menentukan.",
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
