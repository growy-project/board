import { IconAperture, IconInfoCircle, IconLayoutDashboard, IconMoodHappy } from "@tabler/icons-react";

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
    title: "About",
    icon: IconInfoCircle,
    href: "/about",
  },
];

export default Menuitems;
