"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { recordAuthEvent } from "@/lib/auth/audit";

export async function signOutMember() {
  const session = await getCurrentMemberSession();
  await auth.signOut();
  await recordAuthEvent("sign_out", session?.memberId);
  redirect("/signin");
}
