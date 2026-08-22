"use server";

import { getMemberRepository } from "@/lib/data";

export async function setPreferredPharmacyAction(id: string) {
  await getMemberRepository().setPreferredPharmacy(id);
}
