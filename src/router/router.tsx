import AppLayout from "@/layouts/app.layout";
import AdminLayout from "@/layouts/admin.layout";
import StaffLayout from "@/layouts/staff.layout";
import {
  DashBoardPage,
  FleetManagementPage,
  // CustomerManagementPage,
  StaffManagementPage,
  ReportsPage,
  CarManufacturePage,
} from "@/page/admin";
import RentalHistoryPage from "@/page/admin/customer-management/rental-history";
import ComplaintsPage from "@/page/admin/customer-management/complaints";
import {
  AccountProfile,
  AccountTrips,
  BookCar,
  ChangePassword,
  HomePage,
  PayCar,
  Payment,
  Profile,
  SearchCar,
  TripDetails,
} from "@/page/renter";

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "@/layouts/guard.layout";
import { TripManagement } from "@/page/staff";
import StaffTripDetails from "@/page/staff/trip-management/components/trip-details";
import { lazy } from "react";

const ContractPage = lazy(() => import("@/page/paper/contract"));
const HandoverInspectionPage = lazy(
  () => import("@/page/paper/hand-over-inspection")
);

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
            children: [
              { path: ":orderId", element: <TripDetails /> },
              { path: ":orderId/contract", element: <ContractPage /> },
              {
                path: ":orderId/handover-inspection",
                element: <HandoverInspectionPage />,
              },
            ],
          },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },

      {
        path: "/admin",
        element: (
          <AuthGuard requiredRole={"ADMIN"} fallbackPath="/">
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
          // {
          //   path: "customer-management",
          //   element: <CustomerManagementPage />,
          // },
          {
            path: "customer-management/rental-history",
            element: <RentalHistoryPage />,
          },
          {
            path: "customer-management/complaints",
            element: <ComplaintsPage />,
          },
          {
            path: "staff-management",
            element: <StaffManagementPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
          {
            path: "car-manufacture",
            element: <CarManufacturePage />,
          },
        ],
      },
      {
        path: "/staff",
        element: (
          <AuthGuard requiredRole={"STAFF"} fallbackPath="/">
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
          {
            path: "trip/:orderId",
            element: <StaffTripDetails />,
          },
          {
            path: "trip/:orderId/contract",
            element: <ContractPage />,
          },
          {
            path: "trip/:orderId/handover-inspection",
            element: <HandoverInspectionPage />,
          },
        ],
      },
    ],
  },
]);
