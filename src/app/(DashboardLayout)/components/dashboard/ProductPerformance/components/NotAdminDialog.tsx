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

interface NotAdminDialogProps {
  open: boolean;
  action: "toxic" | "topGrowth" | null;
  message: string;
  onMessageChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function NotAdminDialog({
  open,
  action,
  message,
  onMessageChange,
  onCancel,
  onSubmit,
}: NotAdminDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Administrator action required</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="warning">
            To mark this item as{" "}
            <strong>{action === "toxic" ? "Toxic" : "Top Growth"}</strong>, you must be an
            administrator. Send a message to the administrator to request this.
          </Alert>
          <TextField
            label="Reason"
            multiline
            rows={4}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            inputProps={{ maxLength: 300 }}
            helperText={`${message.length}/300`}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          disabled={message.trim().length < 5}
          onClick={onSubmit}
          sx={{ backgroundColor: "#278ab0", "&:hover": { backgroundColor: "#1c4670" } }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
