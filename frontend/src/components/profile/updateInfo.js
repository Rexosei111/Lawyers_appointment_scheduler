import {
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const validate = (values) => {
  let errors = {};

  if (!values.first_name) {
    errors.first_name = "Required Field";
  }
  if (!values.last_name) {
    errors.last_name = "Required Field";
  }

  return errors;
};

export default function UpdateInfo({
  personalInfo,
  handleClose,
  setPersonalInfo,
}) {
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
  const [token, setToken] = useLocalStorage("token", null);

  const initialValues = {
    first_name: personalInfo.first_name,
    other_names: personalInfo.other_names,
    last_name: personalInfo.last_name,
    gender: personalInfo.gender,
  };

  const navigate = useNavigate();
  const small = useMediaQuery("(max-width:500px)");

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      setError(false);
      try {
        const { data } = await API.patch(
          "lawyers/me",
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
        setFormLoading(false);
        setPersonalInfo((prevState) => ({ ...prevState, ...data }));
        setSuccess(true);
        setError(false);
        formik.values = initialValues;
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
        Update Your Info
      </Typography>
      <form
        action="#"
        method="POST"
        id="social"
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
              (formik.touched.first_name && formik.errors.first_name) ||
              (error && errorMessage.first_name)
                ? true
                : false
            }
            id="first_name"
            first_name="first_name"
            label="first_name"
            helperText={
              formik.touched.first_name && formik.errors.first_name
                ? formik.errors.first_name
                : error && errorMessage.first_name
                ? errorMessage.first_name[0]
                : null
            }
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-first_name"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.first_name && formik.errors.first_name) ||
                (error && errorMessage.first_name) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          ></TextField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.last_name && formik.errors.last_name) ||
              (error && errorMessage.last_name)
                ? true
                : false
            }
            id="last_name"
            name="last_name"
            label="last_name"
            helperText={
              formik.touched.last_name && formik.errors.last_name
                ? formik.errors.last_name
                : error && errorMessage.last_name
                ? errorMessage.last_name[0]
                : null
            }
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-last_name"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.last_name && formik.errors.last_name) ||
                (error && errorMessage.last_name) ? (
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
              (formik.touched.other_names && formik.errors.other_names) ||
              (error && errorMessage.other_names)
                ? true
                : false
            }
            id="other_names"
            name="other_names"
            label="other_names"
            helperText={
              formik.touched.other_names && formik.errors.other_names
                ? formik.errors.other_names
                : error && errorMessage.other_names
                ? errorMessage.other_names[0]
                : null
            }
            value={formik.values.other_names}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-other_names"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.other_names && formik.errors.other_names) ||
                (error && errorMessage.other_names) ? (
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
          {"Update"}
        </LoadingButton>
      </form>
    </Paper>
  );
}
