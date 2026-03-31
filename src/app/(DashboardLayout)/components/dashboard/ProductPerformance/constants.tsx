import React from "react";
import { keyframes } from "@emotion/react";
import { Box, Typography } from "@mui/material";

export const ADMIN_EMAIL = "growyserver@gmail.com";

export const pulseAnimation = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(39, 138, 176, 0.7); }
  70%  { box-shadow: 0 0 0 8px rgba(39, 138, 176, 0); }
  100% { box-shadow: 0 0 0 0 rgba(39, 138, 176, 0); }
`;

export const EPS_TOOLTIP_CONTENT = (
  <Box>
    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
      Earnings Per Share(EPS)
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      It tells you how much profit a company makes for each outstanding share.
    </Typography>
    <Typography variant="body2">
      EPS = (Net Income − Preferred Dividends) / Average Outstanding Shares
    </Typography>
  </Box>
);

export const RSI_TOOLTIP_CONTENT = (
  <Box>
    <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
      Relative Strength Index (RSI)
    </Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      Stocks trending up often hold RSI above 50 without dipping too much.
    </Typography>
    <Typography variant="body2">
      A sustained RSI between 55–70 indicates controlled growth (not overheated).
    </Typography>
  </Box>
);
