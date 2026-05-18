import React from "react";
import { keyframes } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const ADMIN_EMAIL = "growyserver@gmail.com";

export const pulseAnimation = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(39, 138, 176, 0.7); }
  70%  { box-shadow: 0 0 0 8px rgba(39, 138, 176, 0); }
  100% { box-shadow: 0 0 0 0 rgba(39, 138, 176, 0); }
`;

export function EpsTooltipContent() {
  const t = useTranslations("table.tooltips.eps");
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        {t("title")}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {t("body1")}
      </Typography>
      <Typography variant="body2">{t("body2")}</Typography>
    </Box>
  );
}

export function RsiTooltipContent() {
  const t = useTranslations("table.tooltips.rsi");
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        {t("title")}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {t("body1")}
      </Typography>
      <Typography variant="body2">{t("body2")}</Typography>
    </Box>
  );
}
