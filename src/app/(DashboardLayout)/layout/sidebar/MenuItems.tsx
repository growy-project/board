import { IconBookmark, IconInfoCircle, IconLayoutDashboard } from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "My Watchlist",
    icon: IconBookmark,
    href: "/my-watchlist",
  },
  {
    id: uniqueId(),
    title: "About",
    icon: IconInfoCircle,
    href: "/about",
  },
];

export default Menuitems;
