import { Dialog, DialogTitle, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import EditUserFields from "./EditUserFields";

export default function EditUser(props) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setOpen(true)}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle color="primary">Employee Details</DialogTitle>
        <EditUserFields setOpen={setOpen} props={props} />
      </Dialog>
    </>
  );
}
