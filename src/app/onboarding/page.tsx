import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/register");
  }

  const user = await currentUser();
  const metadata = user?.publicMetadata as Record<string, unknown> | undefined;

  if (metadata?.onboarding_completed) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}
