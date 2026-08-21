"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || !password) return { error: "Name, email, and password are required." };

  const { error } = await auth.signUp.email({ email, name, password });
  if (error) return { error: error.message || "Failed to create account." };

  redirect("/dashboard");
}
