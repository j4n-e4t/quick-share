import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { turso, wakeTurso } from "@/server/db";
import { encrypt, decrypt, hashCode } from "@/lib/crypto";

function parseDuration(duration: string) {
  switch (duration) {
    case "1h":
      return new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();
    case "24h":
      return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    case "7d":
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }
}

export type Share = {
  id: number;
  code: string;
  title: string | null;
  content: string;
  created_at: Date;
  expires_at: Date;
};

async function getCachedShare(code: string): Promise<Share> {
  const result = (
    await turso.execute({
      sql: "SELECT * FROM share WHERE code = ?",
      args: [await hashCode(code)],
    })
  ).rows[0];

  if (!result) {
    throw new Error("Share not found");
  }

  return {
    id: result.id as number,
    code: code,
    title: result.title as string | null,
    content: result.content as string,
    created_at: new Date(result.created_at as string),
    expires_at: new Date(result.expires_at as string),
  };
}

export const shareRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        availableUntil: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const code = Array.from({ length: 3 }, () =>
        String.fromCharCode(
          65 + ((Math.floor(Math.random() * 26) + Date.now()) % 26),
        ),
      ).join("");

      await turso.execute({
        sql: "INSERT INTO share (title, content, code, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
        args: [
          await encrypt(input.title),
          await encrypt(input.content),
          await hashCode(code),
          new Date().toISOString(),
          parseDuration(input.availableUntil),
        ],
      });

      return code;
    }),

  get: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const share = await getCachedShare(input.code);

      if (!share) {
        throw new Error("Share not found");
      }

      if (new Date() > new Date(share.expires_at)) {
        await turso.execute({
          sql: "DELETE FROM share WHERE code = ?",
          args: [await hashCode(input.code)],
        });

        throw new Error("Share has expired");
      }

      return {
        id: share.id,
        title: await decrypt(share.title!),
        content: await decrypt(share.content),
        expires_at: share.expires_at,
        created_at: share.created_at,
        code: input.code,
      };
    }),

  wakeTurso: publicProcedure.mutation(async () => {
    await wakeTurso();
    return new Response(null, { status: 200 });
  }),
});
