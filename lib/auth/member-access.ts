import type { MemberSession } from "@/lib/auth/session";

export type MemberAccessDestination = "/signin" | "/verify-email" | "/enroll" | "/dashboard";

export function getMemberAccessDestination(
  session: MemberSession | null,
  memberLinked: boolean
): MemberAccessDestination {
  if (!session) return "/signin";
  if (!session.emailVerified) return "/verify-email";
  if (!memberLinked) return "/enroll";
  return "/dashboard";
}
