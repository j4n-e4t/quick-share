import CryptoJS from "crypto-js";
import crypto from "crypto";
import { env } from "@/env";

export function encrypt(content: string): string {
  return CryptoJS.AES.encrypt(content, env.ENCRYPTION_KEY!).toString();
}

export function decrypt(content: string): string {
  return CryptoJS.AES.decrypt(content, env.ENCRYPTION_KEY!).toString(
    CryptoJS.enc.Utf8,
  );
}

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}
