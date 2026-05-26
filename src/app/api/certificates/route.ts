import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourseBySlug } from "@/lib/content";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { courseSlug?: string; shareLinkedIn?: boolean };
  try {
    body = (await request.json()) as { courseSlug?: string; shareLinkedIn?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.courseSlug) {
    return NextResponse.json({ error: "Course slug required" }, { status: 400 });
  }

  // Get user info
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  // Strip non-ASCII so pdf-lib Helvetica doesn't crash on em-dash/emoji
  const userName = (fullName || user.username || userEmail.split("@")[0])
    .replace(/[^\x20-\x7E]/g, "")
    .slice(0, 60) || "Student";

  // Get course info
  const course = await getCourseBySlug(body.courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Check if certificate already exists
  const { data: existingCert } = await supabaseAdmin
    .from("certificates")
    .select("*")
    .eq("user_email", userEmail)
    .eq("course_slug", body.courseSlug)
    .maybeSingle();

  const existingRow = existingCert as { certificate_url?: string | null } | null;
  let certificateUrl = existingRow?.certificate_url ?? null;

  if (!certificateUrl) {
    try {
      certificateUrl = await generateCertificate(userName, course.title, userId, userEmail);

      // Save certificate record
      const { error: insertErr } = await supabaseAdmin.from("certificates").insert({
        user_email: userEmail,
        course_slug: body.courseSlug,
        certificate_url: certificateUrl,
      });
      if (insertErr) {
        console.error("[certificates] insert row failed:", insertErr);
      }
    } catch (genError) {
      const errMsg = genError instanceof Error ? genError.message : String(genError);
      console.error("[certificates] generation error:", errMsg, genError);
      return NextResponse.json(
        { error: `Failed to generate certificate: ${errMsg}` },
        { status: 500 }
      );
    }
  }

  // Generate LinkedIn share URL if requested
  if (body.shareLinkedIn) {
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      `🎉 Saya baru saja menyelesaikan course "${course.title}" di Kaalupi! 🚀\n\n` +
      `Tingkatkan skill IT Anda dengan course berkualitas di Kaalupi - Platform Course IT Indonesia.\n\n` +
      `#Kaalupi #ITCourse #${course.category.replace(" ", "")} #LearningJourney`
    )}`;
    return NextResponse.json({ url: certificateUrl, linkedInUrl });
  }

  return NextResponse.json({ url: certificateUrl });
}

async function generateCertificate(userName: string, courseTitle: string, userId: string, userEmail: string): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();

  // Sanitize courseTitle: Helvetica standard font ngga support em-dash, smart quote, dll.
  // Plus storage path ngga support special chars. Bersihin sekali, dipake buat draw + filename.
  const safeCourseTitle = courseTitle
    .replace(/[—–]/g, "-")          // em/en dash → hyphen
    .replace(/[""'']/g, "'")         // smart quotes → straight
    .replace(/[^\x20-\x7E]/g, "")    // remaining non-ASCII (emoji, dll) → strip
    .trim()
    .slice(0, 80) || "Kaalupi Course";

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background color
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.96, 0.94, 0.88), // #FEFBF5
  });

  // Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.18, 0.31, 0.09), // #2D5016
    borderWidth: 3,
  });

  const centerX = (text: string, f: typeof font, size: number) =>
    width / 2 - f.widthOfTextAtSize(text, size) / 2;

  // Title
  const titleText = "SERTIFIKAT PENYELESAIAN";
  page.drawText(titleText, {
    x: centerX(titleText, font, 28),
    y: height - 120,
    size: 28,
    font,
    color: rgb(0.18, 0.31, 0.09),
  });

  // Certificate text
  const handedText = "Diberikan kepada:";
  page.drawText(handedText, {
    x: centerX(handedText, fontRegular, 14),
    y: height - 180,
    size: 14,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  // User name
  page.drawText(userName, {
    x: centerX(userName, font, 32),
    y: height - 225,
    size: 32,
    font,
    color: rgb(0.96, 0.65, 0.16), // #F5A62A
  });

  // Course name
  const overText = "Atas penyelesaian course:";
  page.drawText(overText, {
    x: centerX(overText, fontRegular, 14),
    y: height - 275,
    size: 14,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  page.drawText(safeCourseTitle, {
    x: centerX(safeCourseTitle, font, 20),
    y: height - 310,
    size: 20,
    font,
    color: rgb(0.18, 0.31, 0.09),
  });

  // Date
  const date = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateText = `Tanggal: ${date}`;
  page.drawText(dateText, {
    x: centerX(dateText, fontRegular, 12),
    y: height - 370,
    size: 12,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  // Kaalupi signature
  const signature = "Kaalupi - AI-First Career Platform Indonesia";
  page.drawText(signature, {
    x: centerX(signature, fontRegular, 10),
    y: 60,
    size: 10,
    font: fontRegular,
    color: rgb(0.47, 0.65, 0.28), // #7AB648
  });

  // Serial number
  const serial = `CERT-${Date.now()}-${userId.slice(0, 8)}`;
  page.drawText(serial, {
    x: 40,
    y: 40,
    size: 8,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // Sanitize email + course title for filename — Supabase storage path
  // butuh ASCII safe, no spaces, no special chars.
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, "_");
  const safeFileTitle = safeCourseTitle.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  const fileName = `${safeEmail}/${safeFileTitle}-${Date.now()}.pdf`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from("certificates")
    .upload(fileName, pdfBytes, {
      contentType: "application/pdf",
      upsert: true, // safe: each call has unique timestamp
    });

  if (uploadError) {
    console.error("[certificates] storage upload error:", uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('certificates')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
