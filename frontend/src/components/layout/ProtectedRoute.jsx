"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRole && role !== allowedRole) {
      router.replace(role === "ORGANIZER" ? "/organizer/dashboard" : "/customer/dashboard");
    }
  }, [isAuthenticated, role, allowedRole, router]);

  if (!isAuthenticated || (allowedRole && role !== allowedRole)) {
    return null;
  }

  return children;
}