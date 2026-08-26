"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { recordAuthEvent } from "@/lib/auth/audit";

export async function resetPassword(_prevState: { error: string } | null, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("password") ?? "");
  if (!token || newPassword.length < 8) return { error: "Use a valid reset link and a password of at least 8 characters." };
  const { error } = await auth.resetPassword({ token, newPassword });
  if (error) return { error: error.message || "The reset link is invalid or expired." };
  await recordAuthEvent("password_reset_completed");
  redirect("/signin?password=reset");
}
