"use server";

import { auth } from "@/lib/auth/server";
import { recordAuthEvent } from "@/lib/auth/audit";

export async function requestPasswordReset(
  _prevState: { message?: string; error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };
  await auth.requestPasswordReset({ email, redirectTo: "/reset-password" });
  await recordAuthEvent("password_reset_requested", undefined, { email: email.toLowerCase() });
  return { message: "If that address belongs to an account, a password reset link is on its way." };
}
