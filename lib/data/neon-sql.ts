import { Pool } from "@neondatabase/serverless";
import type { SqlExecutor } from "@/lib/data/postgres-member-repository";

let pool: Pool | undefined;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required when VEYRA_DATA_PROVIDER=postgres.");
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  return pool;
}

export const neonSqlExecutor: SqlExecutor = async <T = Record<string, unknown>>(
  statement: string,
  params: unknown[] = []
): Promise<T[]> => {
  const result = await getPool().query(statement, params);
  return result.rows as T[];
};
