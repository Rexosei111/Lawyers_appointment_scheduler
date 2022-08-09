import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { API, axiosConfig, uploadAPI } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import { Navigate, useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  name: "",
  company: "",
  title: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required Field";
  }

  if (!values.name) {
    errors.name = "Required Field";
  }
  if (!values.title) {
    errors.title = "Required Field";
  }
  if (!values.company) {
    errors.company = "Required Field";
  }

  return errors;
};

function TestimonialForm({ setTestimonial, handleClose }) {
  const [formloading, setFormLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState(null);
  const large = useMediaQuery("(max-width:900px)");
  const formRef = useRef();
  const [File, setFile] = useState(null);
  const [Link, setLink] = useState("");
  const [progress, setProgress] = useState(null);
  const [loading, setFileLoading] = useState(false);
  const navigate = useNavigate();

  const [token, setToken] = useLocalStorage("token", null);

  const small = useMediaQuery("(max-width:500px)");
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      setError(false);
      try {
        const { data } = await API.post(
          "lawyers/me/testimonials",
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
        setFormLoading(false);
        setTestimonial((prevState) => [...prevState, { ...data }]);
        setSuccess(true);
        setError(false);
        formik.values = initialValues;
        setFile(null);
        setLink(null);
        handleClose(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response.status === 401) navigate("/auth/login");
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

  return (
    <Paper
      variant="elevation"
      elevation={3}
      sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}
    >
      <Typography
        variant="h4"
        mb={3}
        textAlign={"center"}
        sx={{ textTransform: "uppercase" }}
      >
        Request A Testimonial
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
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
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
                  <BadgeOutlinedIcon color="action" />
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
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
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

          {/* <Button
              variant="contained"
              color="primary"
              component="span"
              disableElevation
              sx={{ my: 1 }}
            >
              Choose a file
            </Button> */}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.title && formik.errors.title) ||
              (error && errorMessage.title)
                ? true
                : false
            }
            id="title"
            name="title"
            label="title"
            helperText={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : error && errorMessage.title
                ? errorMessage.title[0]
                : null
            }
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-title"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.title && formik.errors.title) ||
                (error && errorMessage.title) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          />

          {/* <Button
              variant="contained"
              color="primary"
              component="span"
              disableElevation
              sx={{ my: 1 }}
            >
              Choose a file
            </Button> */}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.company && formik.errors.company) ||
              (error && errorMessage.company)
                ? true
                : false
            }
            id="company"
            name="company"
            label="company"
            helperText={
              formik.touched.company && formik.errors.company
                ? formik.errors.company
                : error && errorMessage.company
                ? errorMessage.company[0]
                : null
            }
            value={formik.values.company}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="current-company"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.company && formik.errors.company) ||
                (error && errorMessage.company) ? (
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
    </Paper>
  );
}

export default TestimonialForm;
