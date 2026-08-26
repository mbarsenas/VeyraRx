"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { createSignInFailureMetadata, recordAuthEvent } from "@/lib/auth/audit";
import { getCurrentMemberSession } from "@/lib/auth/session";

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const { data, error } = await auth.signIn.email({
    email,
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    await recordAuthEvent("sign_in_failed", undefined, createSignInFailureMetadata(email));
    return { error: error.message || "Failed to sign in." };
  }
  const session = await getCurrentMemberSession();
  await recordAuthEvent("sign_in_succeeded", session?.memberId ?? data?.user?.id, { email });
  if (session && !session.emailVerified) redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  redirect("/dashboard");
}
