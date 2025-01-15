import { z } from "zod";
import crypto from "crypto";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { shares } from "@/server/db/schema";
import { db } from "@/server/db";
import { revalidateTag, unstable_cache } from "next/cache";

function parseDuration(duration: string) {
  switch (duration) {
    case "1h":
      return new Date(Date.now() + 1 * 60 * 60 * 1000);
    case "24h":
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    default:
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
}

function getCachedShare(code: string) {
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  return unstable_cache(
    async () => {
      console.log("cache miss");
      const result = await db.query.shares.findFirst({
        where: eq(shares.code, codeHash),
      });

      if (!result) {
        throw new Error("Share not found");
      }

      return result;
    },
    [`share-${code}`],
    {
      tags: [`share-${code}`],
    },
  )();
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
      const timestamp = Date.now();
      const code = Array.from({ length: 3 }, () =>
        String.fromCharCode(
          65 + ((Math.floor(Math.random() * 26) + timestamp) % 26),
        ),
      ).join("");
      const codeHash = crypto.createHash("sha256").update(code).digest("hex");

      const share = await db
        .insert(shares)
        .values({
          title: input.title,
          content: input.content,
          code: codeHash,
          availableUntil: parseDuration(input.availableUntil),
        })
        .returning();

      return {
        share,
        code,
      };
    }),

  get: publicProcedure
    .input(z.object({ code: z.string(), is_viewed: z.boolean() }))
    .query(async ({ input }) => {
      const share = await getCachedShare(input.code);

      if (!share) {
        throw new Error("Share not found");
      }

      if (share.availableUntil < new Date()) {
        await db
          .delete(shares)
          .where(
            eq(
              shares.code,
              crypto.createHash("sha256").update(input.code).digest("hex"),
            ),
          );
        revalidateTag(`share-${input.code}`);
        throw new Error("Share has expired");
      }

      return share;
    }),
});
