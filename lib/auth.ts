import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "admin_session";
const SESSION_TOKEN = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_TOKEN;
}

export async function authenticate(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
