"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/writing", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show nav on login page
  if (pathname === "/login") return null;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <nav className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            Keith O&apos;Brien
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-1 ${
                      pathname === link.href
                        ? "text-orange-500 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className={`text-sm px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  pathname === "/contact"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
                }`}
              >
                Contact
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                title="Log out"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="sr-only">Log out</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <ul className="space-y-1">
              {[...links, { href: "/contact", label: "Contact" }].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 text-sm transition-colors hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${
                      pathname === link.href
                        ? "text-orange-500 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className="mt-4 pt-4 border-t border-gray-100 w-full text-left text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
