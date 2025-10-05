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
import {
  BookCar,
  HomePage,
  PayCar,
  Payment,
  Profile,
  SearchCar,
} from "@/page/renter";

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "@/layouts/guard.layout";
import TripDetails from "@/page/renter/profile/account-trips/details";
import AccountTrips from "@/page/renter/profile/account-trips";
import AccountProfile from "@/page/renter/profile/account-profile";
import PasswordChange from "@/page/renter/profile/change-password";
import { TripManagement } from "@/page/staff";

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
        path: "/account",
        element: <Profile />,
        children: [
          {
            index: true,
            element: <Navigate to="/account/my-profile" replace />,
          },
          { path: "my-profile", element: <AccountProfile /> },
          {
            path: "my-trip",
            element: <AccountTrips />,
            children: [{ path: ":orderId", element: <TripDetails /> }],
          },
          { path: "change-password", element: <PasswordChange /> },
        ],
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
            element: <Navigate to="/staff/trip" replace />,
          },
          {
            path: "trip",
            element: <TripManagement />,
          },
        ],
      },
    ],
  },
]);
