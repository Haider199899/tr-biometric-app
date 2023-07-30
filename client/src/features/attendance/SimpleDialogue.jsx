import * as React from "react";
import Button from "@mui/material/Button";
import DialogContents from "./DialogContents";
import DetailsIcon from "@mui/icons-material/Details";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from "@mui/material";
export default function SimpleDialogue(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
 
 <Tooltip title="Details">
      <IconButton color='primary' onClick={handleClickOpen}>
        <FingerprintIcon fontSize="medium" />
      </IconButton>
    </Tooltip>

      <DialogContents
        biometricTime={props.biometricTime}
        name={props.name}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
