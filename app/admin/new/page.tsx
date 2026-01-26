import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ContentForm from "../content-form";

export default async function NewContentPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Content</h1>
      <ContentForm />
    </div>
  );
}
