"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createEnrollment } from "@/lib/db";

const FREE_COURSE_SLUG = "ai-untuk-pemula";

async function autoEnrollFreeCourse(): Promise<void> {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return;
  try {
    await createEnrollment(email, FREE_COURSE_SLUG);
  } catch (err) {
    console.error("auto-enroll failed", err);
  }
}

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const goal = formData.get("goal") as string;
  const interest = formData.get("interest") as string;
  const joinDiscord = formData.get("join_discord") === "on";
  const joinWhatsapp = formData.get("join_whatsapp") === "on";

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_goal: goal || null,
        onboarding_interest: interest || null,
        intent_join_discord: joinDiscord,
        intent_join_whatsapp: joinWhatsapp,
      },
    });
    await autoEnrollFreeCourse();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save onboarding data" };
  }
}

export async function skipOnboarding() {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_skipped: true,
      },
    });
    await autoEnrollFreeCourse();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to skip onboarding" };
  }
}
