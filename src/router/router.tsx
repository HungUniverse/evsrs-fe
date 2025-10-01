import AppLayout from "@/layouts/app.layout";
import AdminLayout from "@/layouts/admin.layout";
import {
  DashBoardPage,
  FleetManagementPage,
  CustomerManagementPage,
  StaffManagementPage,
  ReportsPage,
} from "@/page/admin";
import { BookCar, HomePage, SearchCar } from "@/page/renter";

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "@/layouts/guard.layout";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/search-car",
        element: <SearchCar />,
      },
      {
        path: "/book-car/:id",
        element: <BookCar />,
      },
      {
        path: "/admin",
        element: (
          <AuthGuard requiredRole={1} fallbackPath="/">
            <AdminLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashBoardPage />,
          },
          {
            path: "fleet-management",
            element: <FleetManagementPage />,
          },
          {
            path: "customer-management",
            element: <CustomerManagementPage />,
          },
          {
            path: "staff-management",
            element: <StaffManagementPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
]);
