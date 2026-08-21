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
      memberId: "demo-member-4821",
      email: "mark@example.com",
      displayName: "Mark B.",
    };
  }

  throw new Error(
    "Production authentication is not configured. Install and configure the production identity provider before setting VEYRA_AUTH_MODE=production."
  );
}
