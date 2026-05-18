import { IconBookmark, IconInfoCircle, IconLayoutDashboard } from "@tabler/icons-react";

import { uniqueId } from "lodash";

type MenuKey =
  | "home"
  | "dashboard"
  | "watchlist"
  | "about"
  | "auth"
  | "login"
  | "logout";

export type MenuItem = {
  navlabel?: boolean;
  subheaderKey?: MenuKey;
  id?: string;
  titleKey?: MenuKey;
  icon?: React.ComponentType<{ stroke?: number | string; size?: string | number }>;
  href?: string;
  disabled?: boolean;
  external?: boolean;
};

const Menuitems: MenuItem[] = [
  {
    navlabel: true,
    subheaderKey: "home",
  },

  {
    id: uniqueId(),
    titleKey: "dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    id: uniqueId(),
    titleKey: "watchlist",
    icon: IconBookmark,
    href: "/my-watchlist",
  },
  {
    id: uniqueId(),
    titleKey: "about",
    icon: IconInfoCircle,
    href: "/about",
  },
];

export default Menuitems;
