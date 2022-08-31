import { InputAdornment, Paper, TextField, Typography, useMediaQuery } from '@mui/material'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { API } from '../../lib/Axios_init';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';


const initialValues = {
    email: "",
    
  };
  
  const validate = (values) => {
    let errors = {};
  
    if (!values.email) {
      errors.email = "Required Field";
    }
      return errors;
  };
  
export default function CheckEmail({setVerified, setEmail}) {
  const small = useMediaQuery("(max-width:500px)");
  const [formloading, setFormLoading] = useState(false);
  const [error, setError] = useState(false);


  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      setError(false);
      setEmail(values.email)
      try {
        const response = await API.post(`check?email=${values.email}`);
        setFormLoading(false);
        setError(false)
        formik.values = initialValues;
        if (response.status === 200) {
            setVerified(true)
        }
        if (response.status === 201) {
            setVerified(false)
        }
        // handleClose(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
        //   setErrorMessage((prevState) => ({
        //     ...prevState,
        //     ...error.response.data,
        //   }));
          setFormLoading(false);
        //   setSuccess(false);
          setError(true);
        }
      }
    },
    validate,
  });

  return (
    <Paper variant="elevation"
    elevation={3}
    sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}>
         <Typography
            variant="h4"
            mb={3}
            textAlign={"center"}
            sx={{ textTransform: "uppercase" }}
          >
            Book An Appointment
          </Typography>
          <form method='POST' action="#" onSubmit={formik.handleSubmit}>

          {/* <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            > */}
              <TextField
                error={
                  (formik.touched.email && formik.errors.email) && true
                    
                }
                id="email"
                name="email"
                label="Email"
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email : "Kindly Enter your email to check for verification"
                    
                }
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                autoComplete="current-email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (formik.touched.email && formik.errors.email) && (
                      <InputAdornment position="end">
                        <ErrorOutlineIcon color="error" />
                      </InputAdornment>
                    )
                }}
                fullWidth
              />
            {/* </div> */}
            <LoadingButton
              variant="contained"
            //   endIcon={<SaveIcon />}
              loadingPosition="end"
              loading={formloading}
              type="submit"
              sx={{
                bgcolor: error && "#fd251a",
                "&:hover": {
                  bgcolor: error && "#fd251a90",
                },
                // ml: "auto",
                mt: 2
              }}
            >
              send
            </LoadingButton>
                </form>
    </Paper>
  )
}
