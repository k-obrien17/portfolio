import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminContentList from "./admin-content-list";

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">Content</h1>
      </div>

      <AdminContentList />
    </div>
  );
}
