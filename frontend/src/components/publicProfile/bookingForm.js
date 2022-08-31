import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { API } from "../../lib/Axios_init";
import { Link, useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const initialValues = {
  email: "",
  name: "",
  description: "",
  work_at: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required Field";
  }

  if (!values.name) {
    errors.name = "Required Field";
  }
  if (!values.location) {
    errors.location = "Required Field";
  }
  if (!values.description) {
    errors.description = "Required Field";
  }

  return errors;
};

function BookingForm({ handleClose, email }) {
  const [formloading, setFormLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState(null);
  const params = useParams();
  const [link, setLink] = useState(null);

  const small = useMediaQuery("(max-width:500px)");
  initialValues.email = email
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      setError(false);
      try {
        const { data } = await API.post(`lawyers/${params.id}/book`, {
          ...values,
          booking_date: new Date(date).toLocaleDateString(),
        });
        console.log(data);
        setLink(data.link);
        setFormLoading(false);
        setSuccess(true);
        setError(false);
        formik.values = initialValues;
        handleClose(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage((prevState) => ({
            ...prevState,
            ...error.response.data,
          }));
          setFormLoading(false);
          setSuccess(false);
          setError(true);
        }
      }
    },
    validate,
  });

  const cancelAppointment = async () => {
    await API.delete(`appointments/${link.slice(-2)}`);
  };
  useEffect(() => {
    setSuccess(false);
  }, []);

  return (
    <Paper
      variant="elevation"
      elevation={3}
      sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}
    >
      {success === false ? (
        <>
          <Typography
            variant="h4"
            mb={3}
            textAlign={"center"}
            sx={{ textTransform: "uppercase" }}
          >
            Book An Appointment
          </Typography>
          <form
            action="#"
            method="POST"
            id="testimonial"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: small ? "100%" : 400,
            }}
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <TextField
                error={
                  (formik.touched.email && formik.errors.email) ||
                  (error && errorMessage.email)
                    ? true
                    : false
                }
                id="email"
                name="email"
                label="Email"
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : error && errorMessage.email
                    ? errorMessage.email[0]
                    : null
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
                    (formik.touched.email && formik.errors.email) ||
                    (error && errorMessage.email) ? (
                      <InputAdornment position="end">
                        <ErrorOutlineIcon color="error" />
                      </InputAdornment>
                    ) : undefined,
                }}
                fullWidth
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <TextField
                error={
                  (formik.touched.name && formik.errors.name) ||
                  (error && errorMessage.name)
                    ? true
                    : false
                }
                id="name"
                name="name"
                label="Name"
                helperText={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : error && errorMessage.name
                    ? errorMessage.name[0]
                    : null
                }
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder=""
                autoComplete="current-name"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (formik.touched.name && formik.errors.name) ||
                    (error && errorMessage.name) ? (
                      <InputAdornment position="end">
                        <ErrorOutlineIcon color="error" />
                      </InputAdornment>
                    ) : undefined,
                }}
                fullWidth
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <TextField
                error={
                  (formik.touched.location && formik.errors.location) ||
                  (error && errorMessage.location)
                    ? true
                    : false
                }
                id="location"
                name="location"
                label="location"
                helperText={
                  formik.touched.location && formik.errors.location
                    ? formik.errors.location
                    : error && errorMessage.location
                    ? errorMessage.location[0]
                    : null
                }
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your location"
                autoComplete="current-location"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (formik.touched.location && formik.errors.location) ||
                    (error && errorMessage.location) ? (
                      <InputAdornment position="end">
                        <ErrorOutlineIcon color="error" />
                      </InputAdornment>
                    ) : undefined,
                }}
                fullWidth
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <TextField
                error={
                  (formik.touched.work_at && formik.errors.work_at) ||
                  (error && errorMessage.work_at)
                    ? true
                    : false
                }
                id="work_at"
                name="work_at"
                label="work"
                helperText={
                  formik.touched.work_at && formik.errors.work_at
                    ? formik.errors.work_at
                    : error && errorMessage.work_at
                    ? errorMessage.work_at[0]
                    : null
                }
                value={formik.values.work}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Where do you work?"
                autoComplete="current-work"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment:
                    (formik.touched.work_at && formik.errors.work_at) ||
                    (error && errorMessage.work_at) ? (
                      <InputAdornment position="end">
                        <ErrorOutlineIcon color="error" />
                      </InputAdornment>
                    ) : undefined,
                }}
                fullWidth
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack flexDirection={"row"} columnGap={2}>
                  <MobileDatePicker
                    label="Date"
                    inputFormat="yyy/mm/dd"
                    views={["year", "month", "day"]}
                    openTo="year"
                    name="date"
                    disablePast
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    helperText={
                      error && errorMessage.booking_date
                        ? errorMessage.booking_date[0]
                        : "Appointment Date"
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <TextField
                error={
                  (formik.touched.description && formik.errors.description) ||
                  (error && errorMessage.description)
                    ? true
                    : false
                }
                multiline
                rows={5}
                id="description"
                name="description"
                label="description"
                helperText={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : error && errorMessage.description
                    ? errorMessage.description[0]
                    : "Describe what the appointment is about"
                }
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="current-description"
                variant="outlined"
                InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <MailOutlineIcon color="action" />
                  //   </InputAdornment>
                  // ),
                  endAdornment:
                    (formik.touched.description && formik.errors.description) ||
                    (error && errorMessage.description) ? (
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
              endIcon={<SaveIcon />}
              loadingPosition="end"
              loading={formloading}
              type="submit"
              sx={{
                bgcolor: error && "#fd251a",
                "&:hover": {
                  bgcolor: error && "#fd251a90",
                },
                ml: "auto",
              }}
            >
              {"Send Request"}
            </LoadingButton>
          </form>
        </>
      ) : (
        <Stack alignItems={"center"} justifyContent={"center"} spacing={2}>
          <CheckCircleOutlineIcon
            sx={{ width: 150, height: 150, color: "green" }}
            color="green"
          />
          <Typography variant="h6" textAlign={"center"}>
            All Done
          </Typography>
          <Typography variant="caption" textAlign={"center"}>
            You will recieve an Email to confirm your booking. The email will
            contain a link to check the status of your booking
          </Typography>
          <Typography textAlign={"center"} component={Link} to={link}>
            {link}
          </Typography>
          <Button onClick={cancelAppointment}>Cancel Booking</Button>
        </Stack>
      )}
    </Paper>
  );
}

export default BookingForm;
