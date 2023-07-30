import {
  Alert,
  Box,
  Button,
  Container,
  DialogActions,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@mui/material";
import React from "react";
import { Formik } from "formik";

import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import CircularLoader from "./CircularLoader";

const ResetPasswordFields = ({ setOpen }) => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [showSuccess, setShowSuccess] =useState(false);
  const [load, setLoad] =useState(false);

  const theme = useTheme();
  const [showPassword, setShowPassword] =useState(false);
  const [openSnackbar, setOpenSnakbar] =useState(false);
  const [searchParams, setSearchParams] = useSearchParams()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
         {load && <CircularLoader/>}
      <Formik
        initialValues={{
          password: "",
          cpassword: "", // 'admin@silverstay.com',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .max(16, "Too Long !")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            )
            .required("password is required"),
          cpassword: Yup.string()
            .required("confirm password is required")
            .oneOf([Yup.ref("password")], "Passwords does not match"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setLoad(true)
       const email = searchParams.get('email')
          const code = searchParams.get('code')
          try {
            await resetPassword(email, code,values.password).then(
              () => {
                setShowSuccess(true);
                setLoad(false)
                setOpenSnakbar(true);
                setTimeout(() => {
                  setOpen(false);
                  navigate("/signin");
                }, 1200);
              },
              (err) => {
                setShowSuccess(false);
                setLoad(false)
                setOpenSnakbar(true);
              }
            );
          
          } catch (error) {
          
           return error
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <Container sx={{ p: 2 }}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <FormControl
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 4 }}
              >
                <InputLabel htmlFor="outlined-adornment-password-add">
                  New Password
                </InputLabel>

                <OutlinedInput
                  error={Boolean(touched.password && errors.password)}
                  variant="standard"
                  id="outlined-adornment-password-add"
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  label="New Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputProps={{}}
                  fullWidth
                />
                {touched.password && errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-add"
                  >
                    {errors.password}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 4 }}
              >
                <InputLabel htmlFor="outlined-adornment-cpassword-add">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  error={Boolean(touched.cpassword && errors.cpassword)}
                  type={showPassword ? "text" : "password"}
                  variant="standard"
                  id="outlined-adornment-cpassword-add"
                  value={values.cpassword}
                  name="cpassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Confirm password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputProps={{}}
                />
                {touched.cpassword && errors.cpassword && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-cpassword-add"
                  >
                    {errors.cpassword}
                  </FormHelperText>
                )}
              </FormControl>

              <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={()=>setOpenSnakbar(false)}
        >
<Alert onClose={()=>setOpenSnakbar(false)} severity={showSuccess?'success':'error'} sx={{ width: '100%' }}>
   {showSuccess?'Password set successfully':'Password Cannot be set'}
  </Alert>
        </Snackbar>
        
              <DialogActions>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disableElevation
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  Reset
                </Button>
              </DialogActions>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={1000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={() => setOpenSnakbar(false)}
              >
                <Alert
                  onClose={() => setOpenSnakbar(false)}
                  severity={showSuccess ? "success" : "error"}
                  sx={{ width: "100%" }}
                >
                  {showSuccess
                    ? "Password saved successfully"
                    : "Some error occured please try again"}
                </Alert>
              </Snackbar>
            </Box>
          </Container>
        )}
      </Formik>
    </>
  );
};
export default ResetPasswordFields;
