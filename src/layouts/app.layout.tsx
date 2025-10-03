import QueryProvider from "@/components/providers/query.provider";
import ThemeProvider from "@/components/providers/theme.provider";
import { AuthProvider } from "@/context/auth-context";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function AppLayout() {
  return (
    <>
      <QueryProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthProvider>
            <Outlet />
            <Toaster position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </>
  );
}
