"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { recordAuthEvent } from "@/lib/auth/audit";

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const { data, error } = await auth.signIn.email({
    email,
    password: String(formData.get("password") ?? ""),
  });

  if (error) return { error: error.message || "Failed to sign in." };
  await recordAuthEvent("sign_in_succeeded", data?.user?.id, { email });
  redirect("/dashboard");
}
