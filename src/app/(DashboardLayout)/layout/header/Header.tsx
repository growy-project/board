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
import PropTypes from "prop-types";
import Link from "next/link";
// components
import Profile from "./Profile";
import { IconMenu } from "@tabler/icons-react";
import { useAuth } from "@/app/context/AuthContext";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
  toggleSidebar: () => void;
}

const Header = ({ toggleMobileSidebar, toggleSidebar }: ItemType) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { user } = useAuth();

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
          aria-label="menu"
          onClick={lgUp ? toggleSidebar : toggleMobileSidebar}
          sx={{
            display: "inline-flex",
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {!user && (
            <Button
              variant="contained"
              component={Link}
              href="/authentication/login"
              disableElevation
              sx={{
                backgroundColor: "#278ab0", // Blue Grotto
                color: "white",
                "&:hover": {
                  backgroundColor: "#1c4670", // Blue
                },
              }}
            >
              Login
            </Button>
          )}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
