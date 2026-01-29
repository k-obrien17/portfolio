import Link from "next/link";

export default function PageCTA() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
      <p className="text-gray-600 text-sm">
        B2B tech ghostwriter helping executives build authority through content.
      </p>
      <Link
        href="/contact"
        className="shrink-0 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
      >
        Get in touch →
      </Link>
    </div>
  );
}
