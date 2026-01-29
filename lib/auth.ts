import { cookies } from "next/headers";
import { createToken, verifyToken, timingSafeEqual } from "./session";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE = "admin_session";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;
  return verifyToken(session.value, "admin");
}

export async function authenticate(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) return false;
  if (!timingSafeEqual(password, ADMIN_PASSWORD)) return false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createToken("admin"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
  return true;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
