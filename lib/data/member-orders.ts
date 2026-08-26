import type { MedicationOrder } from "@/lib/domain/order";
import { resolveAuthenticatedMemberId, useDataApi } from "@/lib/data/authenticated-member";
import { dataApiSelect } from "@/lib/data/data-api";
import { neonSqlExecutor } from "@/lib/data/neon-sql";
import { createMemberOrdersRepository } from "@/lib/data/member-orders-repository";

const repository = createMemberOrdersRepository({ resolveMemberId: resolveAuthenticatedMemberId, isDataApi: useDataApi, selectFromDataApi: dataApiSelect, executeSql: neonSqlExecutor });
export async function getAuthenticatedMemberOrders(): Promise<MedicationOrder[]> { return repository.list(); }
export async function getAuthenticatedMemberOrderBySlug(slug: string): Promise<MedicationOrder | undefined> { return repository.findBySlug(slug); }
