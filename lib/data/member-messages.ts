import type { MemberMessage } from "@/lib/domain/message";
import { resolveAuthenticatedMemberId, useDataApi } from "@/lib/data/authenticated-member";
import { dataApiSelect, dataApiUpdate } from "@/lib/data/data-api";
import { neonSqlExecutor } from "@/lib/data/neon-sql";
import { createMemberMessagesRepository } from "@/lib/data/member-messages-repository";

const repository = createMemberMessagesRepository({ resolveMemberId: resolveAuthenticatedMemberId, isDataApi: useDataApi, selectFromDataApi: dataApiSelect, updateDataApi: dataApiUpdate, executeSql: neonSqlExecutor });
export async function getAuthenticatedMemberMessages(): Promise<MemberMessage[]> { return repository.list(); }
export async function markAuthenticatedMessageRead(messageId: string): Promise<void> { return repository.markRead(messageId); }
