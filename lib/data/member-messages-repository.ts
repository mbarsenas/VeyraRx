import type { MemberMessage, MessageCategory } from "@/lib/domain/message";

type MessageRow = { id: string; subject: string; preview: string; body: string; sender: string; category: MessageCategory; is_read: boolean; sent_at: string };
type SelectApi = <T>(table: string, select: string, filters?: string[], order?: string, limit?: number) => Promise<T[]>;
type UpdateApi = <T extends Record<string, unknown>>(table: string, values: T, filters: string[]) => Promise<void>;
type Sql = <T = Record<string, unknown>>(statement: string, params?: unknown[]) => Promise<T[]>;
type Dependencies = { resolveMemberId: () => Promise<string>; isDataApi: () => boolean; selectFromDataApi: SelectApi; updateDataApi: UpdateApi; executeSql: Sql; now?: () => Date };
const columns = "id,subject,preview,body,sender,category,is_read,sent_at";
const eq = (value: string) => `eq.${encodeURIComponent(value)}`;
const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
const mapMessage = (row: MessageRow): MemberMessage => ({ id: row.id, subject: row.subject, preview: row.preview, body: row.body, sender: row.sender, date: formatDate(row.sent_at), category: row.category, unread: !row.is_read });

export function createMemberMessagesRepository(dependencies: Dependencies) {
  async function list(): Promise<MemberMessage[]> {
    const memberId = await dependencies.resolveMemberId();
    const rows = dependencies.isDataApi()
      ? await dependencies.selectFromDataApi<MessageRow>("member_messages", columns, [`member_id=${eq(memberId)}`], "sent_at.desc")
      : await dependencies.executeSql<MessageRow>(`SELECT ${columns}\nFROM member_messages\nWHERE member_id = $1\nORDER BY sent_at DESC`, [memberId]);
    return rows.map(mapMessage);
  }
  async function markRead(messageId: string): Promise<void> {
    const memberId = await dependencies.resolveMemberId();
    if (dependencies.isDataApi()) {
      const timestamp = (dependencies.now ?? (() => new Date()))().toISOString();
      await dependencies.updateDataApi("member_messages", { is_read: true, read_at: timestamp, updated_at: timestamp }, [`id=${eq(messageId)}`, `member_id=${eq(memberId)}`]);
      return;
    }
    await dependencies.executeSql(`UPDATE member_messages SET is_read = TRUE, read_at = COALESCE(read_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND member_id = $2`, [messageId, memberId]);
  }
  return { list, markRead };
}
