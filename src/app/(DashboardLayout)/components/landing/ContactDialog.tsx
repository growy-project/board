import React, { useState } from "react";
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
import { sendMessage } from "../../services/messageService";

const TITLE_MAX = 200;
const MESSAGE_MAX = 5000;

interface ContactDialogProps {
  open: boolean;
  token: string;
  onClose: () => void;
  onSent: () => void;
}

export default function ContactDialog({
  open,
  token,
  onClose,
  onSent,
}: ContactDialogProps) {
  const t = useTranslations("landing");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const canSubmit = title.trim().length > 0 && message.trim().length > 0;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(false);
    try {
      await sendMessage(title.trim(), message.trim(), token);
      setTitle("");
      setMessage("");
      onSent();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t("contact.title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{t("contact.error")}</Alert>}
          <TextField
            label={t("contact.titleLabel")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: TITLE_MAX }}
            helperText={t("contact.counter", { current: title.length, max: TITLE_MAX })}
            fullWidth
            disabled={submitting}
          />
          <TextField
            label={t("contact.messageLabel")}
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ maxLength: MESSAGE_MAX }}
            helperText={t("contact.counter", { current: message.length, max: MESSAGE_MAX })}
            fullWidth
            disabled={submitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          {t("contact.cancel")}
        </Button>
        <LoadingButton
          variant="contained"
          loading={submitting}
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{ backgroundColor: "#278ab0", "&:hover": { backgroundColor: "#1c4670" } }}
        >
          {t("contact.send")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
