import type { AppRoute } from "./routes.types";
import { AuthLayout } from "../Layout/LoginLayout";


import HomePage from "../../Pages/HomePage/HomePage";
import DashboardPage from "../../Pages/DashboardPage/DashboardPage";
import LoginPage from "../../Pages/AuthPage/AuthPage";
import { BaseLayout } from "../Layout/BaseLayout";
import { GuestLayout } from "../Layout/GuestLayout";
import StudentsPage from "../../Pages/StudentsPage/StudentsPage";
import Groupspage from "../../Pages/GroupsPage/GroupsPage";
import TeachersPage from "../../Pages/TeachersPage/TeachersPage";
import CoursesPage from "../../Pages/CoursesPage/CoursesPage";
import PaymentsPage from "../../Pages/PaymentsPage/PaymentsPage";
import SettingsPage from "../../Pages/SettingsPage/SettingsPage";


export const routes: AppRoute[] = [
  {
    path: "/",
      layout: GuestLayout,
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
  {
    path: "/students",
    layout: BaseLayout,
    component: StudentsPage,
    isPrivate: true,

  },
  {
    path: "/groups",
    layout: BaseLayout,
    component:Groupspage,
    isPrivate: true,
  },
  {
    path: "/teachers",
    layout: BaseLayout,
    component: TeachersPage,
    isPrivate: true,
  },
  {
    path: "/courses",
    layout: BaseLayout,
    component: CoursesPage,
    isPrivate: true,
  },
  {
    path :"/payments",
    layout: BaseLayout,
    component:PaymentsPage,
    isPrivate: true,
  },
  {
    path: "/settings",
    layout: BaseLayout,
    component: SettingsPage,
    isPrivate: true,
  }
];
