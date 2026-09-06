export interface NavItemConfig {
  title: string;
  href: string;
  icon: "dashboard" | "coach" | "progress" | "modul" | "rank";
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Coach",
    href: "/coach",
    icon: "coach",
  },
  {
    title: "Progress",
    href: "/progress",
    icon: "progress",
  },
  {
    title: "Modul",
    href: "/modul",
    icon: "modul",
  },
  {
    title: "Rank",
    href: "/rank",
    icon: "rank",
  },
];
