

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CircularLoader from './CircularLoader';

export default function ForgetPassword() {
  const navigate=useNavigate();
  const {forgetPassword}=useAuth();
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnakbar] = React.useState(false);
  const [error,setError]=React.useState(false)
  const [success,setSuccess]=React.useState(false);
  const [load,setLoad]=React.useState(false);
   const [email,setEmail]=React.useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange=(e)=>{
    const {value}=e.target;
    setEmail(value)
    let validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    value.match(validRegex)?setError(false):setError(true);
  }

  const handleClick=async()=>{
    try {
      setLoad(true);
      await forgetPassword(email);
      setSuccess(true)
      setEmail('');
      setTimeout(() => {
        setOpen(false);
      }, 1200);

    } catch (err) {
      console.error(err);
      setSuccess(false);

    }
    setLoad(false);
    setOpenSnakbar(true);
   
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
             
      <Button variant="text" onClick={handleClickOpen}>
     Forget Password
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forget Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Enter your email address you'll receive a link to reset password
          </DialogContentText>
         {load &&
         <CircularLoader/>}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            value={email}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={error}
          />
                 <Typography sx={{display:!error?'none':''}} color='red'>Invalid email</Typography>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClick} disabled={error}>Send Link</Button>
        </DialogActions>

        <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={()=>setOpenSnakbar(false)}
        >
<Alert onClose={()=>setOpenSnakbar(false)} severity={success?'success':'error'} sx={{ width: '100%' }}>
   {success?'Link has sent to your email address':'Some error occured please try again'}
  </Alert>
        </Snackbar>

      </Dialog>
    </div>
  );
}