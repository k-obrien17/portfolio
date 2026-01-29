import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET() {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return NextResponse.json({ authenticated: true, passwordRequired: false });
  }

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("site_auth");

  if (authCookie && verifyToken(authCookie.value, "site")) {
    return NextResponse.json({ authenticated: true, passwordRequired: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
