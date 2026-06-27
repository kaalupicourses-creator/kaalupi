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
      {
        id: "qris",
        name: "QRIS (GoPay, ShopeePay, OVO, dll)",
        type: "qris",
        accountName: "Kaalupi",
        accountNumber: "Scan QR di bawah",
        instructions:
          "Buka aplikasi e-wallet (GoPay/ShopeePay/OVO/DANA/LinkAja) -> pilih Scan QRIS -> arahkan kamera ke gambar di bawah -> bayar sesuai nominal.",
        qrImage: "/payment/qris-kaalupi.jpeg",
      },
    ] as PaymentMethod[],
  },
};

export type PaymentMethod = {
  id: "dana" | "bca" | "bsi" | "qris";
  name: string;
  type: "ewallet" | "bank" | "qris";
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
  // ─── CYBER SECURITY (Kamil) ───────────────────────────────────────────────
  {
    slug: "cyber-security-pemula",
    title: "Cyber Security untuk Pemula — Foundation",
    category: "Cyber Security",
    level: "Beginner",
    duration: "Self-paced",
    price: 0,
    summary:
      "Mulai gratis: 3 modul pertama terbuka untuk semua. Pahami ancaman siber, kebiasaan keamanan digital, dan tools dasar — tanpa background teknis. Lanjut ke 5 modul berikutnya dengan jadi Founding Member.",
    hero:
      "3 modul pertama gratis — langsung mulai tanpa kartu kredit. Pahami dunia cyber security dari sudut pandang defender: ancaman nyata, cara kerja hacker, dan kebiasaan aman yang langsung bisa diterapkan.",
    outcomes: [
      "Memahami jenis ancaman siber yang paling umum: phishing, malware, social engineering",
      "Menerapkan kebiasaan keamanan digital yang efektif mulai hari ini",
      "Mengenal tools dan mindset seorang cyber security analyst",
    ],
    modules: [
      "Modul 1 — Landscape ancaman siber & mindset defender",
      "Modul 2 — Keamanan digital dasar: password, 2FA, dan phishing",
      "Modul 3 — Mengenal tools keamanan: VPN, antivirus, dan firewall",
    ],
    format: "video",
    featured: true,
    is_free: true,
    is_lifetime_access: true,
    is_published: true,
  },

  {
    slug: "cyber-security-mastery",
    title: "Cyber Security — Mastery (Founding Members)",
    category: "Cyber Security",
    level: "Beginner to Intermediate",
    duration: "Self-paced",
    price: 149000,
    original_price: 299000,
    founding_members_limit: 100,
    founding_price: 149000,
    regular_price: 299000,
    summary:
      "Lanjutan dari Foundation — 5 modul advanced: web security, network monitoring, incident response, pentest basics, dan final lab portfolio. 100 Founding Members pertama dapet lifetime access ke SEMUA course Kaalupi.",
    hero:
      "Udah selesai 3 modul gratis? Lanjut ke 5 modul berikutnya — web security, pentest, SOC workflow, dan final lab. Founding Members (100 slot) dapet lifetime access ke SEMUA course Kaalupi, sekarang dan yang akan rilis.",
    outcomes: [
      "Memahami Web Security & OWASP Top 10 secara praktis",
      "Bisa melakukan basic network monitoring dan traffic analysis",
      "Mengenal incident response workflow seperti SOC analyst sungguhan",
      "Mengerti dasar-dasar ethical hacking dan pentest methodology",
      "Punya final lab portfolio cyber security yang bisa dipajang di LinkedIn",
    ],
    modules: [
      "Modul 4 — Web Security & OWASP Top 10",
      "Modul 5 — Network Security & Traffic Monitoring",
      "Modul 6 — Incident Response & Log Analysis",
      "Modul 7 — Pentest Basics & Ethical Hacking Lab",
      "Modul 8 — Career Path, Tools, & Final Lab Portfolio",
    ],
    format: "blended",
    featured: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: true,
    perks: [
      "5 modul advanced: web security, pentest, SOC, & final lab",
      "Lifetime access ke SEMUA course Kaalupi (sekarang & yang akan rilis)",
      "Sertifikat resmi Kaalupi (PDF + LinkedIn share)",
      "AI Tutor 24/7 — tanya apa aja per modul",
      "Akses Discord komunitas Founding Members",
      "Badge Founding Member eksklusif & permanen di profil",
      "Update materi gratis selamanya",
      "Final Project: Lab portfolio cyber security siap pajang",
    ],
  },

  // ─── PROGRAMMING (Fairus) ─────────────────────────────────────────────────
  {
    slug: "programming-pemula",
    title: "Programming untuk Pemula — Foundation",
    category: "Programming",
    level: "Beginner",
    duration: "Self-paced",
    price: 0,
    summary:
      "Mulai gratis: pelajari logika programming dan dasar-dasar web development. Cocok buat siapa aja yang mau mulai bisa coding dari nol.",
    hero:
      "Foundation gratis: pahami cara berpikir programmer — logika, problem solving, dan kode pertama lu. 2 modul intro tanpa biaya.",
    outcomes: [
      "Memahami logika dan pola pikir programming",
      "Menulis kode dasar menggunakan JavaScript/Python",
      "Mengenal struktur project web sederhana",
    ],
    modules: [
      "Logika programming & computational thinking",
      "Kode pertama lu: JavaScript/Python dasar",
    ],
    format: "video",
    featured: false,
    comingSoon: true,
    is_free: true,
    is_lifetime_access: true,
    is_published: false,
  },

  {
    slug: "programming-mastery",
    title: "Programming — Mastery (Founding Members)",
    category: "Programming",
    level: "Beginner to Intermediate",
    duration: "Self-paced",
    price: 149000,
    original_price: 299000,
    founding_members_limit: 100,
    founding_price: 149000,
    regular_price: 299000,
    summary:
      "Kuasai web development dari dasar sampai deploy — Founding Members dapet lifetime access ke semua course Kaalupi.",
    hero:
      "Dari logika sampai web app yang beneran jalan di internet. Founding Members dapet lifetime access ke SEMUA course Kaalupi.",
    outcomes: [
      "Membangun web application dengan HTML, CSS, dan JavaScript",
      "Mengerti konsep backend: API, database, dan autentikasi",
      "Bisa deploy project ke internet sendiri",
      "Punya portofolio project nyata di GitHub",
    ],
    modules: [
      "Logika programming & computational thinking",
      "Web Frontend: HTML, CSS, JavaScript",
      "Backend Dasar: API & Database",
      "Version Control & Deployment",
      "Final Project: Web App Portfolio",
    ],
    format: "blended",
    featured: false,
    comingSoon: true,
    is_free: false,
    is_lifetime_access: true,
    is_published: false,
    perks: [
      "Lifetime access ke SEMUA course Kaalupi (sekarang & yang akan rilis)",
      "Sertifikat resmi Kaalupi (PDF + LinkedIn share)",
      "AI Tutor 24/7 — tanya apa aja per modul",
      "Akses Discord komunitas Founding Members",
      "Badge Founding Member eksklusif & permanen",
      "Update materi gratis selamanya",
      "Final Project: Web App yang bisa dipakai beneran",
    ],
  },
];

export const comingSoonTracks = [
  {
    title: "Network Engineer Pro",
    description: "Dasar sampai praktik jaringan enterprise: IP planning, VLAN, routing, switching, dan observability.",
  },
  {
    title: "Cyber Security Analyst",
    description: "Belajar incident workflow, log analysis, web security, hardening, dan lab investigasi.",
  },
  {
    title: "Product UI Designer",
    description: "Pelajari UI systems, wireframing, prototype, visual hierarchy, dan kolaborasi dengan developer.",
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
