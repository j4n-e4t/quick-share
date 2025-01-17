import { env } from "@/env";

async function INTERNAL__getKey(keyString: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyString);

  const hashedKey = await crypto.subtle.digest("SHA-256", keyData);

  return crypto.subtle.importKey(
    "raw",
    hashedKey, // SHA-256 produces exactly 32 bytes
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(content: string, salt: string): Promise<string> {
  const key = await INTERNAL__getKey(env.ENCRYPTION_KEY + salt);
  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );

  const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(content: string, salt: string): Promise<string> {
  const key = await INTERNAL__getKey(env.ENCRYPTION_KEY + salt);

  const data = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
