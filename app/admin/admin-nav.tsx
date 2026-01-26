"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin
            </Link>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Content
            </Link>
            <Link
              href="/admin/new"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              + New
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              View Site &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
