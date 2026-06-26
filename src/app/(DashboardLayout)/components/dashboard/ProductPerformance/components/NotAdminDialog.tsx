import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslations } from "next-intl";

interface NotAdminDialogProps {
  open: boolean;
  message: string;
  submitting: boolean;
  onMessageChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function NotAdminDialog({
  open,
  message,
  submitting,
  onMessageChange,
  onCancel,
  onSubmit,
}: NotAdminDialogProps) {
  const t = useTranslations("notAdmin");
  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="warning">
            {t.rich("explanationTopGrowth", {
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </Alert>
          <TextField
            label={t("reason")}
            multiline
            rows={4}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            inputProps={{ maxLength: 300 }}
            helperText={t("reasonCounter", { current: message.length, max: 300 })}
            fullWidth
            disabled={submitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={submitting}>{t("cancel")}</Button>
        <LoadingButton
          variant="contained"
          loading={submitting}
          disabled={message.trim().length < 5}
          onClick={onSubmit}
          sx={{ backgroundColor: "#278ab0", "&:hover": { backgroundColor: "#1c4670" } }}
        >
          {t("submit")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
