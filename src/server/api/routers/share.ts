import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { redis } from "@/server/db";
import { encrypt, hashCode } from "@/lib/crypto";
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
  id: string;
  code: string | null;
  title: string | null;
  content: string;
  created_at: Date;
  expires_at: Date;
};

export const shareRouter = createTRPCRouter({
  create: publicProcedure.input(newShareSchema).mutation(async ({ input }) => {
    const code = Array.from({ length: 4 }, () =>
      String.fromCharCode(
        65 + ((Math.floor(Math.random() * 26) + Date.now()) % 26),
      ),
    ).join("");

    const id = crypto.randomUUID();

    await redis.set(
      `share:${id}`,
      JSON.stringify({
        title: input.title ? await encrypt(input.title) : null,
        content: await encrypt(input.content),
        created_at: new Date().toISOString(),
        expires_at: parseDuration(input.availableUntil),
      }),
    );
    await redis.set(`codeHashToId:${await hashCode(code.toUpperCase())}`, id);

    return {
      id,
      code,
    };
  }),
});
