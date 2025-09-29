import AppLayout from "@/layouts/app.layout";
import { DashBoardPage} from "@/page/admin";
import { HomePage, SearchCar } from "@/page/renter";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/searchCar",
        element: <SearchCar />,
      },
      {
        path: "/admin/dashboard",
        element: <DashBoardPage />,
      },
    ],
  },
]);
