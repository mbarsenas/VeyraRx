"use server";

import { auth } from "@/lib/auth/server";
import { recordAuthEvent } from "@/lib/auth/audit";
import { authRateLimitPolicies, checkAuthRateLimit } from "@/lib/auth/rate-limit";

export async function requestPasswordReset(
  _prevState: { message?: string; error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email is required." };
  const rateLimit = await checkAuthRateLimit(email, authRateLimitPolicies.passwordReset);
  if (!rateLimit.allowed) {
    await recordAuthEvent("password_reset_rate_limited", undefined, { email });
    return { message: "If that address belongs to an account, a password reset link is on its way." };
  }
  await auth.requestPasswordReset({ email, redirectTo: "/reset-password" });
  await recordAuthEvent("password_reset_requested", undefined, { email });
  return { message: "If that address belongs to an account, a password reset link is on its way." };
}
