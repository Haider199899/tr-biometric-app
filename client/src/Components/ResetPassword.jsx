import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ResetPasswordFields from "./ResetPasswordFields";

export default function ResetPassword() {
  const [open, setOpen] = React.useState(true);

  return (
    <div>

      <Dialog open={open}>
        <DialogTitle>Set Password</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a new Password</DialogContentText>
          <ResetPasswordFields setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
