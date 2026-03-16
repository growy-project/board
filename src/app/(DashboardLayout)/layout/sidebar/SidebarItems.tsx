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
import Link from "next/link";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useAuth } from "@/app/context/AuthContext";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const { user, logout } = useAuth();
  const theme = useTheme();

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
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}

        {/* Auth subheader */}
        <NavGroup item={{ navlabel: true, subheader: "Auth" }} key="auth-subheader" />

        {user ? (
          <List component="div" disablePadding>
            <ListItemStyled>
              <ListItemButton onClick={logout}>
                <ListItemIcon sx={{ minWidth: "36px", p: "3px 0", color: "inherit" }}>
                  <IconLogout stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </ListItemButton>
            </ListItemStyled>
          </List>
        ) : (
          <NavItem
            item={{
              id: "auth-login",
              title: "Login",
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
