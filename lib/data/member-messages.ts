import type { MemberMessage, MessageCategory } from "@/lib/domain/message";
import { resolveAuthenticatedMemberId } from "@/lib/data/authenticated-member";
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
