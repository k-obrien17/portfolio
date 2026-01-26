import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    // If no password is set, allow access
    const response = NextResponse.json({ success: true });
    (await cookies()).set("site_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return response;
  }

  if (password === sitePassword) {
    const response = NextResponse.json({ success: true });
    (await cookies()).set("site_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  (await cookies()).delete("site_auth");
  return NextResponse.json({ success: true });
}
