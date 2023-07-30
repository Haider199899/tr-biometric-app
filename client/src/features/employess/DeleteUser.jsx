import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { deleteEmployee } from "./employeeSlice";
import { useDispatch } from "react-redux";

export default function DeletUser(props) {
  const [open, setOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [openSnackbar, setOpenSnakbar] = React.useState(false);

  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(
      deleteEmployee({
        id:props.id,
      })
    )
      .then((originalPromiseResult) => {
        console.log("deleted");
        setShowSuccess(true);
        setOpenSnakbar(true)
        setTimeout(() => {
          console.log('close now')
          setOpen(false);
        }, 2000);
     
      })
      .catch((rejectedValueOrSerializedError) => {
        setShowSuccess(false);
      setOpenSnakbar(true);
      });
  };
  return (
    <div>
       <Tooltip title="Delete">
   
   
      <IconButton
      
        aria-label="edit"
        onClick={() => setOpen(true)}
      >
        <DeleteIcon sx={{color:'#b90505;'}}/>
      </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        Delete Employee
        </DialogTitle>
        <DialogContent>
       
        <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={()=>setOpenSnakbar(false)}
        >
<Alert onClose={()=>setOpenSnakbar(false)} severity={showSuccess?'success':'error'} sx={{ width: '100%' }}>
   {showSuccess?'Employee deleted successfully':'Employee Cannot be deleted'}
  </Alert>
        </Snackbar>
 
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this employee ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>

          <Button variant="outlined" onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
