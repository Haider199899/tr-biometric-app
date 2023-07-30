import { Dialog, DialogTitle, Fab, Tooltip } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AddButtonFields from "./AddButtonFields";

export default function AddButton() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        title="Add"
        sx={{
          position: "fixed",
          top: { xs: "calc(80%)", md: 90 },
          right: { xs: "calc(40%)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add" onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle color="primary">New Employee Details</DialogTitle>
        <AddButtonFields setOpen={setOpen} />
      </Dialog>
    </>
  );
}
