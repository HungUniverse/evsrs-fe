import React from "react";
import { Outlet } from "react-router-dom";
import { StaffSidebar } from "@/page/staff/components/layout";
import HeaderLite from "@/components/headerLite";

const StaffLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto">
        <HeaderLite />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
