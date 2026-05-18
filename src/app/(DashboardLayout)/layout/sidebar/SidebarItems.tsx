"use client";
import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useAuth } from "@/app/context/AuthContext";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const { user, logout } = useAuth();
  const theme = useTheme();
  const t = useTranslations("menu");

  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "2px",
      padding: "8px 10px",
      borderRadius: "8px",
      backgroundColor: "inherit",
      color: theme.palette.text.secondary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: "#eaeae0",
        color: "#1c4670",
      },
    },
  }));

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          if (item.subheaderKey) {
            return (
              <NavGroup
                item={{ navlabel: true, subheader: t(item.subheaderKey) }}
                key={item.subheaderKey}
              />
            );
          } else {
            return (
              <NavItem
                item={{
                  id: item.id,
                  title: item.titleKey ? t(item.titleKey) : undefined,
                  icon: item.icon,
                  href: item.href,
                  disabled: item.disabled,
                  external: item.external,
                }}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}

        {/* Auth subheader */}
        <NavGroup item={{ navlabel: true, subheader: t("auth") }} key="auth-subheader" />

        {user ? (
          <List component="div" disablePadding>
            <ListItemStyled>
              <ListItemButton onClick={logout}>
                <ListItemIcon sx={{ minWidth: "36px", p: "3px 0", color: "inherit" }}>
                  <IconLogout stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText>{t("logout")}</ListItemText>
              </ListItemButton>
            </ListItemStyled>
          </List>
        ) : (
          <NavItem
            item={{
              id: "auth-login",
              title: t("login"),
              icon: IconLogin,
              href: "/authentication/login",
            }}
            pathDirect={pathDirect}
            onClick={toggleMobileSidebar}
          />
        )}
      </List>
    </Box>
  );
};
export default SidebarItems;
