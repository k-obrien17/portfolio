import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ContentForm from "../content-form";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Content</h1>
      <ContentForm contentId={id} />
    </div>
  );
}
