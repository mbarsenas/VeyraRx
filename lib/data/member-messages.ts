import type { MemberMessage, MessageCategory } from "@/lib/domain/message";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

type MessageRow = {
  id: string;
  subject: string;
  preview: string;
  body: string;
  sender: string;
  category: MessageCategory;
  is_read: boolean;
  sent_at: string;
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function getAuthenticatedMemberMessages(): Promise<MemberMessage[]> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<MessageRow>(
    `SELECT id, subject, preview, body, sender, category, is_read, sent_at
       FROM member_messages
      WHERE member_id = $1
      ORDER BY sent_at DESC`,
    [memberId]
  );

  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    preview: row.preview,
    body: row.body,
    sender: row.sender,
    date: formatDate(row.sent_at),
    category: row.category,
    unread: !row.is_read,
  }));
}

export async function markAuthenticatedMessageRead(messageId: string): Promise<void> {
  const memberId = await resolveAuthenticatedMemberId();

  await neonSqlExecutor(
    `UPDATE member_messages
        SET is_read = TRUE,
            read_at = COALESCE(read_at, CURRENT_TIMESTAMP),
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND member_id = $2`,
    [messageId, memberId]
  );
}
