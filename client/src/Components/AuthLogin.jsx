import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {  Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import useAuth from "../hooks/useAuth";
import ForgetPassword from "./ForgetPassword";
import CircularLoader from "./CircularLoader";

export const AuthLogin = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {load && <CircularLoader />}
      <Formik
        initialValues={{
          email: "", // 'admin@silverstay.com',
          password: "", // password: 'admin!@#',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255, "Email must be at most 255 characters")
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values) => {
          setLoad(true);
          try {
            await login(values.email, values.password).then(
              () => {
                setLoad(false);
                navigate("/");
              },
              (err) => {
                console.log(err)
                const error=err.response?.data?.message || 'Server Error'
                console.log(error)
                setLoad(false)
                setShowError(true);
                setErrorMessage(error)
                setTimeout(() => {
                  setShowError(false);
                }, 1500);
              }
            );
          } catch (err) {
            setLoad(false);
            console.error(err);
            setShowError(true);
            setTimeout(() => {
              console.log(showError);
            }, 3000);
            console.log("error");
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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput, mb: 4 }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email"
                inputProps={{}}
                fullWidth
              />

              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
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
            </FormControl>
            {showError && (
              <Alert severity="error" onClose={()=>setShowError(false)}>
                {errorMessage}
              </Alert>
            )}
            <Button
              type="submit"
              disableElevation
              disabled={isSubmitting}
              size="large"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <ForgetPassword />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </>
  );
};
