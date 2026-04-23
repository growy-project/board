import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const SIDEBAR_WIDTH = "270px";

const scrollbarStyles = {
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#eff2f7",
    borderRadius: "15px",
  },
};

const SidebarContent = ({
  onItemClick,
}: {
  onItemClick?: () => void;
}) => (
  <Box sx={{ width: SIDEBAR_WIDTH, height: "100%", py: 2 }}>
    <Box sx={{ px: 3, pb: 2 }}>
      <img
        src="/images/logos/dark-logo.svg"
        alt="Logo"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </Box>
    <SidebarItems toggleMobileSidebar={onItemClick} />
  </Box>
);

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const handleSidebarClose = () => {
    onSidebarClose({} as React.MouseEvent<HTMLElement>);
  };

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        variant="temporary"
        PaperProps={{
          sx: {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            boxShadow: (theme) => theme.shadows[8],
            ...scrollbarStyles,
          },
        }}
      >
        <SidebarContent onItemClick={handleSidebarClose} />
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <SidebarContent onItemClick={handleSidebarClose} />
    </Drawer>
  );
};

export default MSidebar;
