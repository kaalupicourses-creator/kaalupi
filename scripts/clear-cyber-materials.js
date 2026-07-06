// Hapus semua materi cyber lama dari course flagship (slug tetap "cyber-security-pemula")
// karena kontennya di-reskin jadi Web Dev "The Smart Vibe Coder".
// Fairus nanti nambahin materi Web Dev baru lewat admin panel.
//
// Jalanin: node scripts/clear-cyber-materials.js
// (Pastiin DB Supabase lagi ACTIVE, bukan paused.)

const { createClient } = require("../node_modules/@supabase/supabase-js");
const supabase = createClient(
  "https://lpzjaorzhxqespuojsjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwemphb3J6aHhxZXNwdW9qc2pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg1OTMwMiwiZXhwIjoyMDkzNDM1MzAyfQ.JstoOavT0dmEIErayl6p-I8BhymJbJCZ2_ShNFl2_qE"
);

const SLUG = "cyber-security-pemula";

async function main() {
  // 1. Tunjukin materi lama yang bakal dihapus
  const { data: before, error: readErr } = await supabase
    .from("materials")
    .select("id, title, module_index, order_index")
    .eq("course_slug", SLUG)
    .order("module_index")
    .order("order_index");

  if (readErr) {
    console.error("❌ Gagal baca materials:", readErr.message);
    process.exit(1);
  }

  console.log(`=== ${before?.length ?? 0} materi lama di "${SLUG}" (bakal dihapus) ===`);
  (before ?? []).forEach((m) =>
    console.log(`  mod:${m.module_index} ord:${m.order_index} — ${m.title.slice(0, 55)}`)
  );

  if (!before?.length) {
    console.log("Ga ada materi buat dihapus. Course udah bersih, siap diisi materi Web Dev.");
    return;
  }

  // 2. Hapus semua
  const { error: delErr } = await supabase
    .from("materials")
    .delete()
    .eq("course_slug", SLUG);

  if (delErr) {
    console.error("❌ Gagal hapus:", delErr.message);
    process.exit(1);
  }

  // 3. Konfirmasi bersih
  const { count } = await supabase
    .from("materials")
    .select("id", { count: "exact", head: true })
    .eq("course_slug", SLUG);

  console.log(`\n✅ Selesai. Sisa materi: ${count ?? 0}.`);
  console.log("Course flagship sekarang kosong & siap diisi materi Web Dev-nya Fairus.");
}

main();
