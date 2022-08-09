import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  Box,
  Container,
  InputAdornment,
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
import { API } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import { useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required Field";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid Email Format";
  }
  if (!values.password) {
    errors.password = "Required Field";
  }
  return errors;
};

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const [token, setToken] = useLocalStorage("token", null);

  const navigate = useNavigate();

  const small = useMediaQuery("(max-width:500px)");
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await API.post("auth/login", values);
        setToken(data);
        setLoading(false);
        setError(false);
        navigate(`/lawyers/me`);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage((prevState) => ({
            ...prevState,
            ...error.response.data,
          }));
        }
        setLoading(false);
        setError(true);
      }
    },
    validate,
  });

  return (
    <form
      action="#"
      method="POST"
      id="first"
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
          type="Email"
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
          placeholder="your-email@provider.com"
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

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <TextField
          error={
            (formik.touched.password && formik.errors.password) ||
            (error && errorMessage.password)
              ? true
              : false
          }
          id="password"
          name="password"
          label="Password"
          type={"password"}
          helperText={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : error && errorMessage.password
              ? errorMessage.password[0]
              : null
          }
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="current-password"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessOutlinedIcon color="action" />
              </InputAdornment>
            ),
            endAdornment:
              (formik.touched.password && formik.errors.password) ||
              (error && errorMessage.password) ? (
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
        loading={loading}
        sx={{ ml: "auto" }}
        type="submit"
      >
        Login
      </LoadingButton>
    </form>
    // </Paper>
  );
}

export default LoginForm;
