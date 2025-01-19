import { env } from "@/env";
import { hashCode } from "@/lib/crypto";
import { createClient } from "@libsql/client/web";
import { Share } from "../api/routers/share";

export const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export async function wakeTurso() {
  await turso.execute("SELECT 1");
}

export async function getShareById(id: string): Promise<Share | null> {
  const result = (
    await turso.execute({
      sql: "SELECT * FROM share WHERE id = ?",
      args: [id],
    })
  ).rows[0];

  if (!result) {
    return null;
  }

  return {
    id: result.id as number,
    code: "",
    title: result.title as string | null,
    content: result.content as string,
    created_at: new Date(result.created_at as string),
    expires_at: new Date(result.expires_at as string),
  };
}

export async function getShareIdByCode(code: string): Promise<string | null> {
  const result = (
    await turso.execute({
      sql: "SELECT id FROM share WHERE code = ?",
      args: [await hashCode(code)],
    })
  ).rows[0];

  if (!result) {
    return null;
  }

  return result.id as string;
}
