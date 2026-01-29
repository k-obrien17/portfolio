"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    // Check if authenticated by looking for cookie
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
        }
      } catch {
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="motion-safe:animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!authenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
