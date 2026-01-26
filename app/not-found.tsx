import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-semibold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page not found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Contact me
        </Link>
      </div>
    </div>
  );
}
