import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserProfile } from "@/actions/user";

export default async function OnboardingPage() {
  // Fetch existing profile (if any) so returning users can see and update
  // their current industry instead of starting from a blank form
  const existingUser = await getUserProfile();

  return (
    <main>
      <OnboardingForm industries={industries} existingUser={existingUser} />
    </main>
  );
}