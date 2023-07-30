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
import { addNewEmployee } from "./employeeSlice";
import { alldesgination } from "./allDesignation";
import CircularLoader from "../../Components/CircularLoader";
const allroles= [
{id:1, label: 'Super Admin', value:1234 },
{id:2, label: 'Admin', value: 4567 },
{id:3, label: 'Standar User', value: 7890 },
]

const AddButtonFields = ({ setOpen }) => {

const [showSuccess,setShowSuccess]=useState(false);
const [openSnackbar, setOpenSnakbar] = useState(false);
const [load,setLoad]=useState(false);
 const dispatch=useDispatch();
const theme = useTheme();

return (
  <>
        {load && <CircularLoader/>}
    <Formik
      initialValues={{
        fullName: "",
        email: "", // 'admin@silverstay.com',
        registraionId: "", // password: 'admin!@#',
        designation: "",
        role:7890,
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
        registraionId: Yup.number("Must be a number").required(
          "RegistraionId is required"
        ),
        designation: Yup.string().required("Designation is required"),
        role: Yup.number("Must be a number").required(
          "Role is required"
        ),
      })}
      onSubmit={(values) => {         
                 setLoad(true)
              dispatch(
                  addNewEmployee({
                    name: values.fullName,
                    designation: values.designation,
                    email: values.email,
                    deviceId: Number(values.registraionId),
                    role:values.role,
                  })
                ).unwrap()
                .then(() => {
                  setShowSuccess(true);
                  setLoad(false);
                  setOpenSnakbar(true);
                  //  forgetPassword(values.email)
                   setTimeout(() => {
                    setOpen(false)
                   }, 900);
                  
               
                })
                .catch((rejectedValueOrSerializedError) => {
                  console.log('error ocured here')
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
              sx={{ ...theme.input, mb: 4 }}
            >
              <TextField
              error={Boolean(touched.registraionId && errors.registraionId)}
              variant='standard'
                id="outlined-adornment-registraionId-add"
                type="text"
                value={values.registraionId}
                name="registraionId"
                onBlur={handleBlur}
                onChange={handleChange}
                label="RegistraionId"
                inputProps={{}}
                fullWidth
              />
              {touched.registraionId && errors.registraionId && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-registraionId-add"
                >
                  {errors.registraionId}
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
                  <TextField {...params}    error={Boolean(touched.designation && errors.designation)}   variant='standard'    label="Designation" />
                )}
              />
            </FormControl>


            <FormControl
              fullWidth
              sx={{ ...theme.typography.customInput, mb: 4 }}
            >
              <Autocomplete
                fullWidth
            
                name="role"
                onBlur={handleBlur}
                onChange={(e, newval) => setFieldValue("role", newval.value)}
                disablePortal
                options={allroles}
                defaultValue={{id:3, label: 'Standar User', value: 7890 }}
                isOptionEqualToValue={(option, value) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <TextField {...params}    error={Boolean(touched.role && errors.role)}   variant='standard'    label="Role" />
                )}
              />
            </FormControl>
            <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        onClose={()=>setOpenSnakbar(false)}
        >
<Alert onClose={()=>setOpenSnakbar(false)} severity={showSuccess?'success':'error'} sx={{ width: '100%' }}>
   {showSuccess?'Employee added , Password inivitaion link has sent successfully':'Employee Cannot be added'}
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
                Create
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
