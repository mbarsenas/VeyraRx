import type { MemberProfile } from "@/lib/domain/profile";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

type ProfileRow = {
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  communication_preference: MemberProfile["communicationPreference"] | null;
  paperless: boolean | null;
  refill_reminders: boolean | null;
  order_updates: boolean | null;
};

async function resolveAuthenticatedMemberId(): Promise<string> {
  const session = await getCurrentMemberSession();
  if (!session) throw new Error("An authenticated member session is required.");

  const rows = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 LIMIT 1`,
    [session.memberId]
  );

  if (!rows[0]?.id) {
    throw new Error("This account is not linked to a VeyraRx member record.");
  }

  return rows[0].id;
}

export async function getAuthenticatedMemberProfile(): Promise<MemberProfile> {
  const session = await getCurrentMemberSession();
  if (!session) throw new Error("An authenticated member session is required.");

  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ProfileRow>(
    `SELECT email, phone, address_line1, address_line2, city, state, postal_code,
            communication_preference, paperless, refill_reminders, order_updates
       FROM members
      WHERE id = $1
      LIMIT 1`,
    [memberId]
  );

  const row = rows[0];
  if (!row) throw new Error("Linked member profile was not found.");

  return {
    email: session.email,
    phone: row.phone ?? "",
    address1: row.address_line1 ?? "",
    address2: row.address_line2 ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    postalCode: row.postal_code ?? "",
    communicationPreference: row.communication_preference ?? "Email",
    paperless: row.paperless ?? true,
    refillReminders: row.refill_reminders ?? true,
    orderUpdates: row.order_updates ?? true,
  };
}

export async function updateAuthenticatedMemberProfile(profile: MemberProfile): Promise<void> {
  const memberId = await resolveAuthenticatedMemberId();

  await neonSqlExecutor(
    `UPDATE members
        SET phone = $2,
            address_line1 = $3,
            address_line2 = $4,
            city = $5,
            state = $6,
            postal_code = $7,
            communication_preference = $8,
            paperless = $9,
            refill_reminders = $10,
            order_updates = $11,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $1`,
    [
      memberId,
      profile.phone.trim() || null,
      profile.address1.trim() || null,
      profile.address2.trim() || null,
      profile.city.trim() || null,
      profile.state.trim().toUpperCase() || null,
      profile.postalCode.trim() || null,
      profile.communicationPreference,
      profile.paperless,
      profile.refillReminders,
      profile.orderUpdates,
    ]
  );
}
