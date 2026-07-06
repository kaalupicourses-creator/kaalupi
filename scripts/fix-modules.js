const { createClient } = require("../node_modules/@supabase/supabase-js");
const supabase = createClient(
  "https://lpzjaorzhxqespuojsjo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwemphb3J6aHhxZXNwdW9qc2pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg1OTMwMiwiZXhwIjoyMDkzNDM1MzAyfQ.JstoOavT0dmEIErayl6p-I8BhymJbJCZ2_ShNFl2_qE"
);

const SLUG = "cyber-security-pemula";

async function main() {
  // Show current state
  console.log("=== State sebelum fix ===");
  for (const mod of [5, 6, 7, 8]) {
    const { data } = await supabase
      .from("materials")
      .select("id, title, module_index, order_index")
      .eq("course_slug", SLUG)
      .eq("module_index", mod)
      .order("order_index");
    if (data?.length) {
      console.log(`Mod ${mod}:`);
      data.forEach(m => console.log(`  [${m.order_index}] ${m.title.slice(0, 55)} | ${m.id}`));
    }
  }

  // Step 1: Move Career Path (mod:7 ord:0) → mod:6 ord:2
  // Step 2: Move Final (mod:7 ord:1) → mod:6 ord:3
  // These need to go one at a time to avoid unique constraint issues.

  // Get IDs from mod:7
  const { data: mod7 } = await supabase
    .from("materials")
    .select("id, title, order_index")
    .eq("course_slug", SLUG)
    .eq("module_index", 7)
    .order("order_index");

  console.log("\nMod 7 items to move:", mod7?.map(m => `[${m.order_index}] ${m.title.slice(0, 40)}`));

  // Move Career Path and Final to mod:6, ord:2 and ord:3
  for (const item of (mod7 || [])) {
    const newOrd = item.order_index + 2; // 0→2, 1→3
    const { error } = await supabase
      .from("materials")
      .update({ module_index: 6, order_index: newOrd })
      .eq("id", item.id);
    if (error) console.error(`❌ Move ${item.title.slice(0,30)}: ${error.message}`);
    else console.log(`✅ Moved to mod:6 ord:${newOrd} — ${item.title.slice(0, 40)}`);
  }

  // Step 3: Move B1-B5 (mod:8) → mod:7
  const { data: mod8 } = await supabase
    .from("materials")
    .select("id, title, order_index")
    .eq("course_slug", SLUG)
    .eq("module_index", 8)
    .order("order_index");

  console.log("\nMod 8 items to move to mod:7:", mod8?.map(m => `[${m.order_index}] ${m.title.slice(0, 40)}`));

  for (const item of (mod8 || [])) {
    const { error } = await supabase
      .from("materials")
      .update({ module_index: 7 })
      .eq("id", item.id);
    if (error) console.error(`❌ Move ${item.title.slice(0,30)}: ${error.message}`);
    else console.log(`✅ Moved to mod:7 ord:${item.order_index} — ${item.title.slice(0, 40)}`);
  }

  // Final state
  console.log("\n=== State setelah fix ===");
  for (const mod of [4, 5, 6, 7]) {
    const { data } = await supabase
      .from("materials")
      .select("title, order_index")
      .eq("course_slug", SLUG)
      .eq("module_index", mod)
      .order("order_index");
    if (data?.length) {
      console.log(`Mod ${mod} (${["Web Security","Exploitation","Career+BugBounty","BONUS"][mod-4]}):`);
      data.forEach(m => console.log(`  [${m.order_index}] ${m.title.slice(0, 55)}`));
    }
  }
}

main();
