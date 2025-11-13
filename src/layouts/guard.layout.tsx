import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import type { RoleCode } from "@/@types/auth.type";

export default function AuthGuard({
  children,
  requiredRole,
  fallbackPath = "/",
}: {
  children: React.ReactNode;
  requiredRole?: RoleCode;
  fallbackPath?: string;
}) {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }


  
  if (requiredRole && (!user || !hasRole(requiredRole))) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
