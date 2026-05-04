import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file
config({ path: resolve(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const materials = [
  // Module 0
  {
    course_slug: "ai-untuk-pemula",
    title: "Apa itu Artificial Intelligence?",
    content: `<h2>Apa itu Artificial Intelligence (AI)?</h2>
      <p>Artificial Intelligence (AI) adalah teknologi yang memungkinkan mesin melakukan tugas yang biasanya membutuhkan kecerdasan manusia, seperti:</p>
      <ul>
        <li>Mengenali gambar dan suara</li>
        <li>Membuat keputusan berdasarkan data</li>
        <li>Belajar dari pengalaman (machine learning)</li>
        <li>Memahami dan menghasilkan bahasa manusia (LLM)</li>
      </ul>
      
      <h3>Jenis AI</h3>
      <p>AI terbagi menjadi beberapa jenis:</p>
      <ol>
        <li><strong>Narrow AI (Weak AI)</strong> - AI yang dirancang untuk tugas spesifik, misalnya: Siri, Google Maps, recommendation Netflix.</li>
        <li><strong>General AI (Strong AI)</strong> - AI yang memiliki kecerdasan setara manusia (masih dalam riset).</li>
        <li><strong>Large Language Models (LLM)</strong> - AI yang dilatih dengan dataset besar untuk memahami dan menghasilkan teks, misalnya: ChatGPT, Claude, Gemini.</li>
      </ol>
      
      <h3>Bagaimana LLM Bekerja?</h3>
      <p>LLM bekerja dengan prinsip <strong>prediksi kata berikutnya</strong>. Model dilatih dengan:</p>
      <ul>
        <li>Dataset teks masif (miliaran kata)</li>
        <li>Arsitektur Transformer (attention mechanism)</li>
        <li>Parameter yang mencapai triliunan (misal: GPT-4 ~1.76 triliun parameter)</li>
      </ul>
      
      <div class="bg-[#FFF3D6] p-4 rounded-lg mt-4">
        <p class="text-sm"><strong>📌 Fakta:</strong> ChatGPT dilatih dengan data hingga 2023, sedangkan Claude (Anthropic) menggunakan Constitutional AI - metode pelatihan yang memprioritaskan keamanan dan etika.</p>
      </div>`,
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
    module_index: 0,
    order_index: 0,
  },
  {
    course_slug: "ai-untuk-pemula",
    title: "Lab: Mencoba AI Pertama Kamu",
    content: `<h2>Lab: Mencoba AI Pertama Kamu</h2>
      <p>Dalam lab ini, kita akan mencoba menggunakan AI (Claude atau ChatGPT) untuk tugas praktis.</p>
      
      <h3>Langkah 1: Buat Akun AI</h3>
      <ol>
        <li>Kunjungi <a href="https://claude.ai" target="_blank">Claude.ai</a> atau <a href="https://chat.openai.com" target="_blank">ChatGPT</a></li>
        <li>Buat akun gratis (gunakan email yang aktif)</li>
        <li>Verifikasi akun melalui email</li>
      </ol>
      
      <h3>Langkah 2: Prompt Pertama</h3>
      <p>Cobalah prompt berikut:</p>
      <div class="bg-[#F0E8D8] p-4 rounded-lg font-mono text-sm">
        "Jelaskan apa itu Machine Learning dalam bahasa Indonesia yang sederhana, seolah-olah kamu menjelaskan kepada adik kelas 5 SD. Gunakan analogi yang mudah dipahami."
      </div>
      
      <h3>Langkah 3: Eksperimen dengan Variasi Prompt</h3>
      <p>Cobalah variasi prompt berikut dan bandingkan hasilnya:</p>
      <ul>
        <li>"Jelaskan Machine Learning untuk audiens teknis (programer)"</li>
        <li>"Jelaskan Machine Learning untuk audiens bisnis (manager)"</li>
        <li>"Buatkan ringkasan 3 poin penting tentang Machine Learning"</li>
      </ul>
      
      <h3>Output yang Diharapkan</h3>
      <p>Setelah menyelesaikan lab ini, kamu harus memiliki:</p>
      <ul>
        <li>Akun AI yang aktif</li>
        <li>Memahami perbedaan respon berdasarkan gaya prompt</li>
        <li>Menyadari bahwa AI merespon berdasarkan konteks yang diberikan</li>
      </ul>
      
      <div class="bg-[#E8F5E9] p-4 rounded-lg mt-4">
        <p class="text-sm"><strong>✅ Checklist:</strong></p>
        <ul class="text-sm mt-2">
          <li>☐ Sudah buat akun AI</li>
          <li>☐ Sudah coba minimal 3 variasi prompt</li>
          <li>☐ Sudah paham perbedaan respon</li>
        </ul>
      </div>`,
    module_index: 0,
    order_index: 1,
  },
  // Module 1
  {
    course_slug: "ai-untuk-pemula",
    title: "Dasar Prompt Engineering",
    content: `<h2>Dasar Prompt Engineering</h2>
      <p>Prompt engineering adalah seni dan ilmu dalam merancang input (prompt) yang optimal agar AI memberikan output yang diinginkan.</p>
      
      <h3>Komponen Prompt yang Baik</h3>
      <ol>
        <li><strong>Context (Konteks)</strong> - Latar belakang informasi yang diperlukan AI</li>
        <li><strong>Instruction (Instruksi)</strong> - Perintah yang jelas dan spesifik</li>
        <li><strong>Input Data</strong> - Data atau teks yang ingin diproses</li>
        <li><strong>Output Format</strong> - Format hasil yang diharapkan (JSON, tabel, list, dll)</li>
        <li><strong>Constraint (Batasan)</strong> - Pembatas atau hal yang harus dihindari</li>
      </ol>
      
      <h3>Contoh Prompt yang Baik vs Buruk</h3>
      <table class="w-full border-collapse border border-[#F0E8D8] mt-4">
        <thead>
          <tr class="bg-[#F0E8D8]">
            <th class="border border-[#F0E8D8] p-2 text-left">Buruk</th>
            <th class="border border-[#F0E8D8] p-2 text-left">Baik</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-[#F0E8D8] p-2">"Jelaskan AI"</td>
            <td class="border border-[#F0E8D8] p-2">"Jelaskan apa itu AI dalam 3 paragraf. Gunakan bahasa Indonesia yang casual profesional. Sertakan 2 contoh aplikasi AI di Indonesia."</td>
          </tr>
          <tr>
            <td class="border border-[#F0E8D8] p-2">"Buat kode Python"</td>
            <td class="border border-[#F0E8D8] p-2">"Buatkan kode Python untuk menghitung luas segitiga. Input: alas dan tinggi. Output: cetak luas. Tambahkan komentar penjelas tiap baris kode."</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Teknik Prompt Engineering</h3>
      <ul>
        <li><strong>Zero-shot Prompting</strong> - Langsung meminta output tanpa contoh</li>
        <li><strong>Few-shot Prompting</strong> - Memberikan beberapa contoh (examples) sebelum meminta output</li>
        <li><strong>Chain-of-Thought</strong> - Meminta AI untuk berpikir step-by-step (reasoning)</li>
        <li><strong>Role Prompting</strong> - Memberikan peran tertentu pada AI ("Act as a...")</li>
      </ul>`,
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    module_index: 1,
    order_index: 0,
  },
  // Add more materials as needed...
];

async function seedMaterials() {
  console.log("Starting seed...");
  
  for (const material of materials) {
    const { data, error } = await supabase
      .from("materials")
      .upsert(material, {
        onConflict: "course_slug,module_index,order_index",
      })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ${material.title}:`, error);
    } else {
      console.log(`✅ Inserted: ${material.title}`);
    }
  }

  console.log("Seed completed!");
}

seedMaterials();
