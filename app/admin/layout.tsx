import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminNav from "./admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if this is the login page
  const authenticated = await isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50">
      {authenticated && <AdminNav />}
      <main className={authenticated ? "pt-16" : ""}>{children}</main>
    </div>
  );
}

// Wrapper component for protected pages
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}
