"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function signOutMember() {
  await auth.signOut();
  redirect("/signin");
}
