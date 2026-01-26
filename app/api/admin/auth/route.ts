import { NextRequest, NextResponse } from "next/server";
import { authenticate, logout, isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const success = await authenticate(password);

  if (success) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}
