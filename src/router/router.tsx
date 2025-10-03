import AppLayout from "@/layouts/app.layout";
import AdminLayout from "@/layouts/admin.layout";
import StaffLayout from "@/layouts/staff.layout";
import {
  DashBoardPage,
  FleetManagementPage,
  CustomerManagementPage,
  StaffManagementPage,
  ReportsPage,
} from "@/page/admin";
import { BookCar, HomePage, PayCar, Payment, SearchCar } from "@/page/renter";
import { StaffDashboard, OrderDetailsPage } from "@/page/staff";

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
        path: "/pay-car/:id",
        element: <PayCar />,
      },
      {
        path: "/payment",
        element: <Payment />,
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
      {
        path: "/staff",
        element: (
          <AuthGuard requiredRole={2} fallbackPath="/">
            <StaffLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/staff/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <StaffDashboard />,
          },
          {
            path: "order-details",
            element: <OrderDetailsPage />,
          },
        ],
      },
    ],
  },
]);
