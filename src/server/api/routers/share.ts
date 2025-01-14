import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { eq, sql } from "drizzle-orm";
import { shares } from "@/server/db/schema";
import { db } from "@/server/db";

export const shareRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        maxViews: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const timestamp = Date.now();
      const code = Array.from({ length: 3 }, () =>
        String.fromCharCode(
          65 + ((Math.floor(Math.random() * 26) + timestamp) % 26),
        ),
      ).join("");

      const share = await db
        .insert(shares)
        .values({
          title: input.title,
          content: input.content,
          code,
          maxViews: input.maxViews,
        })
        .returning();

      return share;
    }),

  get: publicProcedure
    .input(z.object({ code: z.string(), is_viewed: z.boolean() }))
    .query(async ({ input }) => {
      const share = await db.query.shares.findFirst({
        where: eq(shares.code, input.code),
      });

      if (!share) {
        throw new Error("Share not found");
      }

      if (share.maxViews && share.views && share.views >= share.maxViews) {
        await db.delete(shares).where(eq(shares.code, input.code));
        throw new Error("Share has reached its maximum views");
      }

      if (input.is_viewed) {
        await db
          .update(shares)
          .set({ views: sql`${shares.views} + 1` })
          .where(eq(shares.code, input.code));
      }

      return share;
    }),
});
