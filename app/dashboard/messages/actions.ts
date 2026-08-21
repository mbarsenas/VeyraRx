"use server";

import { markAuthenticatedMessageRead } from "@/lib/data/member-messages";

export type MarkMessageReadResult = {
  ok: boolean;
};

export async function markMessageRead(messageId: string): Promise<MarkMessageReadResult> {
  if (!messageId) return { ok: false };

  try {
    await markAuthenticatedMessageRead(messageId);
    return { ok: true };
  } catch (error) {
    console.error("Unable to mark member message as read", error);
    return { ok: false };
  }
}
