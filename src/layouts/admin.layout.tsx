import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/page/admin/components/admin-sidebar";
import AdminHeader from "@/page/admin/components/admin-header";


export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarClose={() => setSidebarOpen(false)}
        onSidebarToggle={toggleSidebar}
      />

      {/* Main content, sidebar and header */}
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
      >
        {/* Admin Header */}
        <AdminHeader />
        {/* Page content, render outlet pages */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
