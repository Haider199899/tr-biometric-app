import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  DialogActions,
  FormControl,
  FormHelperText,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { updateEmployee } from "./employeeSlice";
import { alldesgination } from "./allDesignation";
import CircularLoader from "../../Components/CircularLoader";


const allroles= [
  {id:1, label: 'Super Admin', value:1234 },
  {id:2, label: 'Admin', value: 4567 },
  {id:3, label: 'Standar User', value: 7890 },
]



const AddButtonFields = ({ setOpen, props }) => {
  const [showSuccess, setShowSuccess] =useState(false);

  const [openSnackbar, setOpenSnakbar] =useState(false);
  const [load,setLoad]=useState(false)
  const dispatch = useDispatch();
  const theme = useTheme()
   console.log(props)

  const defaultRole=allroles.find(item=>item.value==props.data.role,);
  console.log(defaultRole)
  return (
    <>
      {load && <CircularLoader/>}
      <Formik
        initialValues={{
          fullName: props.data.name,
          email: props.data.email, // 'admin@silverstay.com',
          designation: props.data.designation,
          role:props.data.role,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          fullName: Yup.string()
            .min(3, "Too short")
            .required("Email is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255, "Email must be at most 255 characters")
            .required("Email is required"),
          designation: Yup.string().required("Designation is required"),
          role: Yup.number().required("Role is required"),
        })}
        onSubmit={(values) => {
          setLoad(true)
          dispatch(
            updateEmployee({
              name: values.fullName,
              designation: values.designation,
              email: values.email,
              role:values.role,
              id:props.data.id,
            })
          )
            .unwrap()
            .then((originalPromiseResult) => {
              setShowSuccess(true);
              setLoad(false);
              setOpenSnakbar(true)
              setTimeout(() => {
                setOpen(false);
              }, 900);
            })
            .catch(() => {
              setLoad(false);
              setOpenSnakbar(true)
            });
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          setFieldValue,
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
                <TextField
                  error={Boolean(touched.fullName && errors.fullName)}
                  variant="standard"
                  id="outlined-adornment-fullName-add"
                  value={values.fullName}
                  name="fullName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Full Name"
                  inputProps={{}}
                  fullWidth
                />
                {touched.fullName && errors.fullName && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-fullName-add"
                  >
                    {errors.fullName}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 4 }}
              >
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  variant="standard"
                  id="outlined-adornment-email-add"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Email"
                  inputProps={{}}
                />
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-add"
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>
            
              <FormControl
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 4 }}
              >
                <Autocomplete
                  fullWidth
                  value={values.designation}
                  name="designation"
                  onBlur={handleBlur}
                  onChange={(e, newval) => setFieldValue("designation", newval)}
                  disablePortal
                  options={alldesgination.map((option) => option.label)}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(touched.designation && errors.designation)}
                      variant="standard"
                      label="Designation"
                    />
                  )}
                />
              </FormControl>


              <FormControl
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 4 }}
              >
                <Autocomplete
                  fullWidth
                  // value={values.r}
                  name="role"
                  defaultValue={defaultRole}
                  onBlur={handleBlur}
                  onChange={(e, newval) => setFieldValue("role", newval.value)}
                  disablePortal
                  options={allroles}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(touched.role && errors.role)}
                      variant="standard"
                      label="Role"
                    />
                  )}
                />
              </FormControl>
              <Snackbar
        open={openSnackbar}
        autoHideDuration={1400}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={()=>setOpenSnakbar(false)}
        >
<Alert onClose={()=>setOpenSnakbar(false)} severity={showSuccess?'success':'error'} sx={{ width: '100%' }}>
   {showSuccess?'Employee updated successfully':'Employee Cannot be updated'}
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
                  Update
                </Button>
              </DialogActions>
            </Box>
          </Container>
        )}
      </Formik>
    </>
  );
};

export default AddButtonFields;
