// src/components/auth/AuthGuard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

// 1=Admin, 2=Staff, 3=User
export default function AuthGuard({
  children,
  requiredRole,
  fallbackPath = "/",
}: {
  children: React.ReactNode;
  requiredRole?: 1 | 2 | 3;
  fallbackPath?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }
  return <>{children}</>;
}
