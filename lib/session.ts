import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

export function createToken(scope: "site" | "admin"): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  const payload = `${scope}.${nonce}.${timestamp}`;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyToken(token: string, expectedScope: "site" | "admin"): boolean {
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [scope, nonce, timestamp, providedHmac] = parts;
  if (scope !== expectedScope) return false;
  if (!nonce || !timestamp) return false;

  const payload = `${scope}.${nonce}.${timestamp}`;
  const expectedHmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");

  return timingSafeEqual(providedHmac, expectedHmac);
}

export function timingSafeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}
