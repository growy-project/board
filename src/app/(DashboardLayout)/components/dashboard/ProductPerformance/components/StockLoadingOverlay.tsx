import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ "svg circle": { stroke: "url(#my_gradient)" } }} />
    </React.Fragment>
  );
}

interface StockLoadingOverlayProps {
  message?: string;
}

export default function StockLoadingOverlay({ message }: StockLoadingOverlayProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "800px",
        gap: 2,
      }}
    >
      {message && (
        <Typography variant="body1" color="textPrimary" sx={{ fontSize: "1.1rem" }}>
          {message}
        </Typography>
      )}
      <GradientCircularProgress />
    </Box>
  );
}

export { GradientCircularProgress };
