import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
// components
import Profile from "./Profile";
import LanguageToggle from "./LanguageToggle";
import { IconMenu } from "@tabler/icons-react";
import { useAuth } from "@/app/context/AuthContext";
import { useAppTheme } from "@/app/context/ThemeContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AnchorOutlinedIcon from "@mui/icons-material/AnchorOutlined";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
  toggleSidebar: () => void;
}

const Header = ({ toggleMobileSidebar, toggleSidebar }: ItemType) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { user } = useAuth();
  const { mode, cycleMode } = useAppTheme();
  const t = useTranslations("header");
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const loginHref = React.useMemo(() => {
    const isOnLogin = pathname.startsWith("/authentication/login");
    if (isOnLogin) return "/authentication/login";
    const search = searchParams?.toString() ?? "";
    const returnTo = `${pathname}${search ? `?${search}` : ""}`;
    return `/authentication/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [pathname, searchParams]);

  const ThemeIcon =
    mode === "light"
      ? LightModeOutlinedIcon
      : mode === "dark"
      ? DarkModeOutlinedIcon
      : AnchorOutlinedIcon;

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label={t("menu")}
          onClick={lgUp ? toggleSidebar : toggleMobileSidebar}
          sx={{
            display: "inline-flex",
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <LanguageToggle />
          <IconButton color="inherit" aria-label={t("toggleTheme")} onClick={cycleMode}>
            <ThemeIcon width={20} height={20} />
          </IconButton>
          {!user && (
            <Button
              variant="contained"
              component={Link}
              href={loginHref}
              disableElevation
              sx={{
                backgroundColor: "#278ab0", // Blue Grotto
                color: "white",
                "&:hover": {
                  backgroundColor: "#1c4670", // Blue
                },
              }}
            >
              {t("login")}
            </Button>
          )}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
