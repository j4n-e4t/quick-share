import { hashCode } from "@/lib/crypto";
import { redis } from "@/server/db";
import { redirect } from "next/navigation";

export const runtime = "edge";

export const GET = async (
  req: Request,
  { params }: { params: { code: string } },
) => {
  const { code } = await params;
  if (!code || code.length !== 4) {
    redirect("/");
  }
  const id = (await redis.get(
    `codeHashToId:${await hashCode(code.toUpperCase())}`,
  )) as string;
  if (!id) {
    return new Response("Invalid code", { status: 400 });
  }
  redirect(`/s/${id}`);
};
