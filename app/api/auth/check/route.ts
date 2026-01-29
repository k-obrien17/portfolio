import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const sitePassword = process.env.SITE_PASSWORD;

  // If no password is set, allow access
  if (!sitePassword) {
    return NextResponse.json({ authenticated: true, passwordRequired: false });
  }

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("site_auth");

  if (authCookie && authCookie.value === "authenticated") {
    return NextResponse.json({ authenticated: true, passwordRequired: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
