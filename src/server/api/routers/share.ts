import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getShareById, getShareIdByCode, turso, wakeTurso } from "@/server/db";
import { encrypt, decrypt, hashCode } from "@/lib/crypto";
import { newShareSchema } from "@/lib/zod";

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

export const shareRouter = createTRPCRouter({
  create: publicProcedure.input(newShareSchema).mutation(async ({ input }) => {
    const code = Array.from({ length: 3 }, () =>
      String.fromCharCode(
        65 + ((Math.floor(Math.random() * 26) + Date.now()) % 26),
      ),
    ).join("");

    await turso.execute({
      sql: "INSERT INTO share (id, title, content, code, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        input.title ? await encrypt(input.title) : null,
        await encrypt(input.content),
        await hashCode(code.toUpperCase()),
        new Date().toISOString(),
        parseDuration(input.availableUntil),
      ],
    });

    console.log(await hashCode(code.toUpperCase()));
    console.log(code);

    return code;
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const share = await getShareById(input.id);
      if (!share) {
        throw new Error("Share not found");
      }
      // if (new Date() > new Date(share.expires_at)) {
      //   await turso.execute({
      //     sql: "DELETE FROM share WHERE code = ?",
      //     args: [await hashCode(input.code)],
      //   });

      //   throw new Error("Share has expired");
      // }

      return {
        id: share.id,
        title: share.title ? await decrypt(share.title) : null,
        content: await decrypt(share.content),
        expires_at: share.expires_at,
        created_at: share.created_at,
        code: "",
      };
    }),

  getId: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      // if (new Date() > new Date(share.expires_at)) {
      //   await turso.execute({
      //     sql: "DELETE FROM share WHERE code = ?",
      //     args: [await hashCode(input.code)],
      //   });

      //   throw new Error("Share has expired");
      // }

      return { shareId: await getShareIdByCode(input.code.toUpperCase()) };
    }),

  wakeTurso: publicProcedure.mutation(async () => {
    await wakeTurso();
    return new Response(null, { status: 200 });
  }),
});
