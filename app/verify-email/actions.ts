"use server";

import { auth } from "@/lib/auth/server";
import { recordAuthEvent } from "@/lib/auth/audit";
import { redirect } from "next/navigation";

export async function sendVerificationCode(
  _previous: { message?: string; error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email is required." };
  const { error } = await auth.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  if (error) return { error: error.message || "Unable to send verification code." };
  await recordAuthEvent("verification_email_requested", undefined, { email });
  return { message: "A new verification code was sent." };
}

export async function verifyEmailCode(
  _previous: { error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const otp = String(formData.get("verificationCode") ?? "").trim();
  if (!email || !otp) return { error: "Email and verification code are required." };
  const { data, error } = await auth.emailOtp.verifyEmail({ email, otp });
  if (error) return { error: error.message || "The verification code is invalid or expired." };
  await recordAuthEvent("email_verified", data?.user?.id, { email });
  await auth.signOut();
  redirect("/signin?verified=1");
}
