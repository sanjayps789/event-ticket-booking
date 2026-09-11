"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function NotFound() {
  const { isAuthenticated, role } = useAuth();

  const homeLink = !isAuthenticated
    ? "/login"
    : role === "ORGANIZER"
    ? "/organizer/dashboard"
    : "/customer/dashboard";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <SearchX className="w-16 h-16 text-indigo-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href={homeLink}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700"
      >
        {isAuthenticated ? "Go back home" : "Go to login"}
      </Link>
    </div>
  );
}