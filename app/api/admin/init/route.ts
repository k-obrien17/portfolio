import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initializeDatabase } from "@/lib/db";

// POST initialize database schema
export async function POST() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await initializeDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
