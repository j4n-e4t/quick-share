import { env } from "@/env";
import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export async function wakeTurso() {
  console.log("Waking Turso");
  await turso.execute("SELECT 1");
}
