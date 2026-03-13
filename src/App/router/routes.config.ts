import type { AppRoute } from "./routes.types";
import { AuthLayout } from "../Layout/LoginLayout";


import HomePage from "../../Pages/HomePage/HomePage";
import DashboardPage from "../../Pages/DashboardPage/DashboardPage";
import LoginPage from "../../Pages/AuthPage/AuthPage";
import { BaseLayout } from "../Layout/BaseLayout";


export const routes: AppRoute[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/auth",
    layout: AuthLayout,
    component: LoginPage,
  },
  {
    path: "/dashboard",
    layout: BaseLayout,
    component: DashboardPage,
    isPrivate: true,
  },
];
