"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { recordAuthEvent } from "@/lib/auth/audit";
import { authRateLimitPolicies, checkAuthRateLimit } from "@/lib/auth/rate-limit";

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || !password) return { error: "Name, email, and password are required." };

  const { data, error } = await auth.signUp.email({ email, name, password });
  if (error) return { error: error.message || "Failed to create account." };

  const normalizedEmail = email.toLowerCase();
  await recordAuthEvent("account_created", data?.user?.id, { email: normalizedEmail });
  const verificationRateLimit = await checkAuthRateLimit(normalizedEmail, authRateLimitPolicies.verificationEmail);
  if (verificationRateLimit.allowed) {
    await auth.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    await recordAuthEvent("verification_email_requested", data?.user?.id, { email: normalizedEmail });
  } else {
    await recordAuthEvent("verification_email_rate_limited", data?.user?.id, { email: normalizedEmail });
  }
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
