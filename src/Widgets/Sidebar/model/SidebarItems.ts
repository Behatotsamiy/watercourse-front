import { Home, Users, GraduationCap, BookOpen, Settings, GroupIcon ,BadgeDollarSign } from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Students",
    icon: Users,
    path: "/students",
  },
  {
    title: "Teachers",
    icon: GraduationCap,
    path: "/teachers",
  },
  {
    title:"Groups",
    icon: GroupIcon,
    path: "/groups",
  },
  {
    title: "Courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    title: "Payments",
    icon: BadgeDollarSign,
    path: "/payments",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
