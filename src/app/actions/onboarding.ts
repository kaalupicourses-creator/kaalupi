"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const goal = formData.get("goal") as string;
  const interest = formData.get("interest") as string;

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_goal: goal || null,
        onboarding_interest: interest || null,
      },
    });
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
    return { success: true };
  } catch {
    return { success: false, error: "Failed to skip onboarding" };
  }
}
