"use server";

import type { MemberProfile } from "@/lib/domain/profile";
import { updateAuthenticatedMemberProfile } from "@/lib/data/member-profile";

export type SaveProfileResult = {
  ok: boolean;
  message: string;
};

function normalizeProfile(profile: MemberProfile): MemberProfile {
  const communicationPreference = ["Email", "Text", "Phone"].includes(profile.communicationPreference)
    ? profile.communicationPreference
    : "Email";

  return {
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    address1: profile.address1.trim(),
    address2: profile.address2.trim(),
    city: profile.city.trim(),
    state: profile.state.trim().slice(0, 2).toUpperCase(),
    postalCode: profile.postalCode.trim(),
    communicationPreference,
    paperless: Boolean(profile.paperless),
    refillReminders: Boolean(profile.refillReminders),
    orderUpdates: Boolean(profile.orderUpdates),
  };
}

export async function saveMemberProfile(profile: MemberProfile): Promise<SaveProfileResult> {
  try {
    const normalized = normalizeProfile(profile);
    await updateAuthenticatedMemberProfile(normalized);
    return { ok: true, message: "Profile saved." };
  } catch (error) {
    console.error("Unable to save member profile", error);
    return { ok: false, message: "Unable to save profile. Please try again." };
  }
}
