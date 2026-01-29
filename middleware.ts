import { NextRequest, NextResponse } from "next/server";

const EXCLUDED = ["/login", "/api/auth", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Skip auth for excluded paths and static assets
  if (
    EXCLUDED.some((p) => pathname.startsWith(p)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff2?|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("site_auth")?.value;
  if (!token) {
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
  }

  // Verify HMAC using Web Crypto API (Edge-compatible)
  const parts = token.split(".");
  if (parts.length !== 4) {
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
  }

  const [scope, nonce, timestamp, providedHmac] = parts;
  if (scope !== "site" || !nonce || !timestamp) {
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // No stable secret — can't verify tokens, allow through
    return NextResponse.next();
  }

  const payload = `${scope}.${nonce}.${timestamp}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedHmac = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expectedHmac !== providedHmac) {
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
