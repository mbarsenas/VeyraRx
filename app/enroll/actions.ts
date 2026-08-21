"use server";

import { redirect } from "next/navigation";
import { enrollCurrentAccount } from "@/lib/data/member-enrollment";

export type EnrollmentActionState = {
  ok: boolean;
  message: string;
};

export async function submitEnrollment(
  _previousState: EnrollmentActionState,
  formData: FormData
): Promise<EnrollmentActionState> {
  const code = String(formData.get("code") ?? "").trim();
  const result = await enrollCurrentAccount(code);

  if (result.ok) {
    redirect("/dashboard");
  }

  return result;
}
