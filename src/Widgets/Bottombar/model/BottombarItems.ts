import { Home, Users, BookOpen, Settings, GroupIcon ,BadgeDollarSign , LucideDollarSign} from "lucide-react";

export const bottombarItems = () => [
  {
    title: "Asosiy",
    label:"Dashboard",
    icon: Home,
    path: "/dashboard",
    roles: ['owner', 'admin'],
  },
  {
    title: "O'quvchilar",
    icon: Users,
    path: "/students",
    roles: ['owner', 'admin'],

  },

  {
    title:"Guruhlar",
    icon: GroupIcon,
    path: "/groups",
    roles: ['owner', 'admin'],
  },
  // {
  //   title: "Courses",
  //   icon: BookOpen,
  //   path: "/courses",
  //   roles: ['owner', 'admin'],
  // },
  {
    title: "Hisobot",
    icon: BadgeDollarSign,
    path: "/payments",
    roles: ['owner', 'admin'],
  },

  {
    title: "Sozlamalar",
    icon: Settings,
    path: "/settings",
    roles: ['owner', 'admin'],
  },

  {
    title: "Asosiy",
    icon: Home,
    path: "/teacher/dashboard",
    roles: ['teacher'],
  },
  {
    title:"Guruhlarim",
    icon: GroupIcon,
    path: "/teacher/groups",
    roles: ['teacher'],
  },


];  
