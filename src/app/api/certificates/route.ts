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
  const userName = user.firstName ?? userEmail;

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
      await supabaseAdmin.from("certificates").insert({
        user_email: userEmail,
        course_slug: body.courseSlug,
        certificate_url: certificateUrl,
      });
    } catch (genError) {
      console.error("Certificate generation error:", genError);
      return NextResponse.json(
        { error: "Failed to generate certificate" },
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

  // Title
  page.drawText("SERTIFIKAT PENYELESAIAN", {
    x: width / 2 - 180,
    y: height - 120,
    size: 28,
    font,
    color: rgb(0.18, 0.31, 0.09),
  });

  // Certificate text
  page.drawText("Diberikan kepada:", {
    x: width / 2 - 60,
    y: height - 180,
    size: 14,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  // User name
  page.drawText(userName, {
    x: width / 2 - (userName.length * 8),
    y: height - 220,
    size: 32,
    font,
    color: rgb(0.96, 0.65, 0.16), // #F5A62A
  });

  // Course name
  page.drawText(`Atas penyelesaian course:`, {
    x: width / 2 - 90,
    y: height - 270,
    size: 14,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  page.drawText(courseTitle, {
    x: width / 2 - (courseTitle.length * 4),
    y: height - 300,
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
  page.drawText(`Tanggal: ${date}`, {
    x: width / 2 - 80,
    y: height - 360,
    size: 12,
    font: fontRegular,
    color: rgb(0.27, 0.27, 0.27),
  });

  // Kaalupi signature
  page.drawText("Kaalupi — Platform Course IT Indonesia", {
    x: width / 2 - 130,
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
  
  // Sanitize email for filename
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeEmail}/${courseTitle}-${Date.now()}.pdf`;
  
  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('certificates')
    .upload(fileName, pdfBytes, {
      contentType: 'application/pdf',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('certificates')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
