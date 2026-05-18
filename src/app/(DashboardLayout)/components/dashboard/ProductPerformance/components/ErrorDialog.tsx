import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface ErrorDialogProps {
  error: string | null;
  onClose: () => void;
}

export default function ErrorDialog({ error, onClose }: ErrorDialogProps) {
  const t = useTranslations("errorDialog");
  return (
    <Dialog open={error !== null} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#d32f2f" }}>
          <ErrorOutline />
          <Typography variant="h6">{t("title")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>{error}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: "#278ab0", "&:hover": { backgroundColor: "#1c4670" } }}
        >
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
