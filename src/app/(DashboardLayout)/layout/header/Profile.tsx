import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { IconUser, IconMail, IconListCheck } from "@tabler/icons-react";
import FaceIcon from "@mui/icons-material/Face";
import { useAuth } from "@/app/context/AuthContext";

const Profile = () => {
  const { logout } = useAuth();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: "white",
            color: "#278ab0",
          }}
        >
          <FaceIcon />
        </Avatar>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Tooltip title="To be developed" placement="left">
          <MenuItem>
            <ListItemIcon>
              <IconMail width={20} />
            </ListItemIcon>
            <ListItemText>200 Top Growths</ListItemText>
          </MenuItem>
        </Tooltip>
        <Tooltip title="To be developed" placement="left">
          <MenuItem>
            <ListItemIcon>
              <IconListCheck width={20} />
            </ListItemIcon>
            <ListItemText>My Selected Stocks</ListItemText>
          </MenuItem>
        </Tooltip>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={logout}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#278ab0", // Blue Grotto
              color: "#278ab0", // Blue Grotto
              "&:hover": {
                borderColor: "#1c4670", // Blue
                color: "#1c4670", // Blue
                backgroundColor: "#eaeae0", // Ivory
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
