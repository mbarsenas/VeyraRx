"use server";

import type { MemberProfile } from "@/lib/domain/profile";
import { updateAuthenticatedMemberProfile } from "@/lib/data/member-profile";
import { auth } from "@/lib/auth/server";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { recordAuthEvent } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";

export type SaveProfileResult = {
  ok: boolean;
  message: string;
};

function normalizeProfile(profile: MemberProfile): MemberProfile {
  const communicationPreference = ["Email", "Text", "Phone"].includes(profile.communicationPreference)
    ? profile.communicationPreference
    : "Email";

  return {
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    address1: profile.address1.trim(),
    address2: profile.address2.trim(),
    city: profile.city.trim(),
    state: profile.state.trim().slice(0, 2).toUpperCase(),
    postalCode: profile.postalCode.trim(),
    communicationPreference,
    paperless: Boolean(profile.paperless),
    refillReminders: Boolean(profile.refillReminders),
    orderUpdates: Boolean(profile.orderUpdates),
  };
}

export async function saveMemberProfile(profile: MemberProfile): Promise<SaveProfileResult> {
  try {
    const normalized = normalizeProfile(profile);
    await updateAuthenticatedMemberProfile(normalized);
    return { ok: true, message: "Profile saved." };
  } catch (error) {
    console.error("Unable to save member profile", error);
    return { ok: false, message: "Unable to save profile. Please try again." };
  }
}

export async function signOutOtherSessions() {
  const session = await getCurrentMemberSession();
  const { error } = await auth.revokeOtherSessions();
  if (error) throw new Error(error.message || "Unable to sign out other sessions.");
  await recordAuthEvent("other_sessions_revoked", session?.memberId);
  revalidatePath("/dashboard/profile");
}

export async function sendMemberVerificationEmail() {
  const session = await getCurrentMemberSession();
  if (!session?.email) throw new Error("A signed-in email address is required.");
  const { error } = await auth.emailOtp.sendVerificationOtp({
    email: session.email,
    type: "email-verification",
  });
  if (error) throw new Error(error.message || "Unable to send verification email.");
  await recordAuthEvent("verification_email_requested", session.memberId, { email: session.email.toLowerCase() });
  revalidatePath("/dashboard/profile");
}

export async function verifyMemberEmail(formData: FormData) {
  const session = await getCurrentMemberSession();
  const otp = String(formData.get("verificationCode") ?? "").trim();
  if (!session?.email || !otp) throw new Error("Email and verification code are required.");
  const { error } = await auth.emailOtp.verifyEmail({ email: session.email, otp });
  if (error) throw new Error(error.message || "The verification code is invalid or expired.");
  await recordAuthEvent("email_verified", session.memberId, { email: session.email.toLowerCase() });
  revalidatePath("/dashboard/profile");
}
