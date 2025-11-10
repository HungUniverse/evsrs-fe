import AppLayout from "@/layouts/app.layout";
import AdminLayout from "@/layouts/admin.layout";
import StaffLayout from "@/layouts/staff.layout";
import {
  RenterManagementPage,
  CarManufactureManagementPage,
  ModelManagementPage,
  StaffManagementPage,
  DepotManagementPage,
  OrderManagementPage,
  CarEVManagementPage,
  OverviewDashboardPage,
} from "@/page/admin/index";
import {
  AccountProfile,
  AccountTransactions,
  AccountTrips,
  BookCar,
  ChangePassword,
  HomePage,
  PayCar,
  Payment,
  PoliciesPage,
  Profile,
  SearchCar,
  SecurityPolicies,
  TripDetails,
} from "@/page/renter";

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "@/layouts/guard.layout";
import {
  CreateOrderAtDepot,
  CreateUserAtDepot,
  StaffCarManagement,
  StaffDashboard,
  TripManagement,
} from "@/page/staff";
import StaffTripDetails from "@/page/staff/trip-management/components/trip-details";
import { lazy } from "react";
import {
  CustomerSettlement,
  ReturnInspectionPage,
  ReturnSettementPage,
} from "@/page/paper";
import AmenitiesManagementPage from "@/page/admin/amenities-management";
import AboutPage from "@/page/renter/home-page/components/aboutEV";

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
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/policies",
        element: <PoliciesPage />,
      },
      {
        path: "/security-policies",
        element: <SecurityPolicies />,
      },
      {
        path: "/search-car",
        element: (
          <AuthGuard requiredRole="USER">
            <SearchCar />
          </AuthGuard>
        ),
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
                path: ":orderId/handover/inspection",
                element: <HandoverInspectionPage />,
              },
              {
                path: ":orderId/return/inspection",
                element: <ReturnInspectionPage />,
              },
              {
                path: ":orderId/return/settlement",
                element: <CustomerSettlement />,
              },
            ],
          },
          { path: "transactions", element: <AccountTransactions /> },
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
            element: <Navigate to="/admin/admin-dashboard" replace />,
          },
          {
            path: "renter-management",
            element: <RenterManagementPage />,
          },
          {
            path: "car-manufacture-management",
            element: <CarManufactureManagementPage />,
          },
          {
            path: "model-management",
            element: <ModelManagementPage />,
          },
          {
            path: "staff-management",
            element: <StaffManagementPage />,
          },
          {
            path: "amenities-management",
            element: <AmenitiesManagementPage />,
          },
          {
            path: "depot-management",
            element: <DepotManagementPage />,
          },
          {
            path: "order-booking-management",
            element: <OrderManagementPage />,
          },
          {
            path: "carEV-management",
            element: <CarEVManagementPage />,
          },
          {
            path: "admin-dashboard",
            element: <OverviewDashboardPage />,
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
            element: <Navigate to="/staff/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <StaffDashboard />,
          },
          {
            path: "car",
            element: <StaffCarManagement />,
          },
          {
            path: "trip",
            element: <TripManagement />,
          },
          {
            path: "create-user-at-depot",
            element: <CreateUserAtDepot />,
          },
          {
            path: "create-order-at-depot",
            element: <CreateOrderAtDepot />,
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
            path: "trip/:orderId/handover/inspection",
            element: <HandoverInspectionPage />,
          },
          {
            path: "trip/:orderId/return/inspection",
            element: <ReturnInspectionPage />,
          },
          {
            path: "trip/:orderId/return/settlement",
            element: <ReturnSettementPage />,
          },
        ],
      },
    ],
  },
]);
