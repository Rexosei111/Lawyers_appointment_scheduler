import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  Container,
  InputAdornment,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { useParams } from "react-router-dom";
import { API } from "../../lib/Axios_init";

const initialValues = {
  rating: 0,
  review: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.rating && !values.review) {
    errors.review = "This field may not be left blank";
  }

  return errors;
};

function AppointmentReview({setAddReview}) {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState(null);
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await API.post(`appointments/${params.id}/reviews`, {
          ...values,
          rating: parseInt(values.rating),
        });
        setLoading(false);
        setSuccess(true);
        setError(false);
        setAddReview(false)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage((prevState) => ({
            ...prevState,
            ...error.response.data,
          }));
        }
        setLoading(false);
        setSuccess(false);
        setError(true);
      }
    },
    validate,
  });
  return (
    // <Container
    //   id="registration"
    //   disableGutters
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     width: "100%",
    //     py: 2,
    //     mb: 4,
    //   }}
    // >
    //   <Typography my={2} variant="h5" alignSelf={"flex-start"}>
    //     Add Your Review
    //   </Typography>
      <Paper  elevation={0} sx={{ p: 2, width: "100%" }}>
        <form
          action="#"
          method="POST"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Rating
              value={parseInt(formik.values.rating)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="rating"
              id="rating"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <TextField
              error={
                (formik.touched.review && formik.errors.review) ||
                (error && errorMessage.review)
                  ? true
                  : false
              }
              id="review"
              name="review"
              label="Write your review here..."
              multiline
              rows={6}
              // maxRows={10}
              helperText={
                formik.touched.review && formik.errors.review
                  ? formik.errors.review
                  : error && errorMessage.review
                  ? errorMessage.review[0]
                  : null
              }
              value={formik.values.review}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="current-review"
              variant="outlined"
              InputProps={{
                endAdornment:
                  (formik.touched.review && formik.errors.review) ||
                  (error && errorMessage.review) ? (
                    <InputAdornment position="end">
                      <ErrorOutlineIcon color="error" />
                    </InputAdornment>
                  ) : undefined,
              }}
              fullWidth
            />
          </div>

          <LoadingButton
            variant="contained"
            type="submit"
            loadingPosition="end"
            loading={loading}
            endIcon={<SaveIcon />}
            sx={{
              bgcolor: error ? "#fd251a" : success ? "#55ab6f" : "primary",
              "&:hover": {
                bgcolor: error
                  ? "#fd251a90"
                  : success
                  ? "#55ab6f90"
                  : "primary",
              },
            }}
            disabled={Object.entries(formik.errors).length > 0 ? true : false}
            fullWidth
          >
            Submit
          </LoadingButton>
        </form>
      </Paper>
    // </Container>
  );
}

export default AppointmentReview;
