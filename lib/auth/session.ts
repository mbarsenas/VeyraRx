import { auth } from "@/lib/auth/server";

export type MemberSession = {
  memberId: string;
  email: string;
  displayName: string;
};

export type AuthMode = "demo" | "production";

export async function getCurrentMemberSession(): Promise<MemberSession | null> {
  const mode = (process.env.VEYRA_AUTH_MODE ?? "demo") as AuthMode;

  if (mode === "demo") {
    return {
      memberId: "member-demo-001",
      email: "mark@example.com",
      displayName: "Mark B.",
    };
  }

  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  return {
    memberId: session.user.id,
    email: session.user.email,
    displayName: session.user.name || session.user.email,
  };
}
