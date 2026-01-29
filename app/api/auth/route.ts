import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken, timingSafeEqual } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    (await cookies()).set("site_auth", createToken("site"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ success: true });
  }

  if (timingSafeEqual(password || "", sitePassword)) {
    (await cookies()).set("site_auth", createToken("site"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  (await cookies()).delete("site_auth");
  return NextResponse.json({ success: true });
}
