import { Home, Users, GraduationCap, BookOpen, Settings, GroupIcon ,BadgeDollarSign } from "lucide-react";
import { LogoutButton } from "../../../Shared/ui/logoutButton";

export const sidebarItems = [
  {
    title: "Dashboard",
    label:"Dashboard",
    icon: Home,
    path: "/dashboard",
    roles: ['owner', 'admin'],
  },
  {
    title: "Students",
    icon: Users,
    path: "/students",
    roles: ['owner', 'admin'],

  },
  {
    title: "Staff",
    icon: GraduationCap,
    path: "/staff",
     roles: ['owner', 'admin'],
  },
  {
    title:"Groups",
    icon: GroupIcon,
    path: "/groups",
    roles: ['owner', 'admin'],
  },
  {
    title: "Courses",
    icon: BookOpen,
    path: "/courses",
    roles: ['owner', 'admin'],
  },
  {
    title: "Payments",
    icon: BadgeDollarSign,
    path: "/payments",
    roles: ['owner', 'admin'],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ['owner', 'admin'],
  },
      {
    title: "Dashboard",
    icon: Home,
    path: "/teacher/dashboard",
    roles: ['teacher'],
  },
  {
    title:"My groups",
    icon: GroupIcon,
    path: "/teacher/groups",
    roles: ['teacher'],
  },
 

];  
