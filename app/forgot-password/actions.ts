"use server";

import { auth } from "@/lib/auth/server";

export async function requestPasswordReset(
  _prevState: { message?: string; error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };
  await auth.requestPasswordReset({ email, redirectTo: "/reset-password" });
  return { message: "If that address belongs to an account, a password reset link is on its way." };
}
