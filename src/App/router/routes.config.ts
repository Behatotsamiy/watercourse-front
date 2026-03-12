import type { AppRoute } from "./routes.types";

import  HomePage  from "../../Pages/HomePage/HomePage";
import  DashboardPage  from "../../Pages/DashboardPage/DashboardPage";

export const routes: AppRoute[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    isPrivate: true,
  },
];