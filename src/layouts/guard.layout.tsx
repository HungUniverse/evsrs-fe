import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

//1 admin, 2 staff, 3 user
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
