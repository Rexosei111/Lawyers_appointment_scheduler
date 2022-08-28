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

const initialValues = {
  name: "",
  link: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "Required Field";
  }
  if (!values.link) {
    errors.link = "Required Field";
  }

  return errors;
};

const medias = ["Facebook", "Twitter", "Instagram", "LinkedIn"];
export default function SocialForm({ setSocialLinks, handleClose }) {
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

  const navigate = useNavigate();
  const small = useMediaQuery("(max-width:500px)");

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      setError(false);
      try {
        const { data } = await API.post(
          "lawyers/me/links",
          { ...values },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
        setFormLoading(false);
        setSocialLinks((prevState) => [...prevState, { ...data }]);
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
        Add A new Link
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
            select
            error={
              (formik.touched.name && formik.errors.name) ||
              (error && errorMessage.name)
                ? true
                : false
            }
            id="name"
            name="name"
            label="name"
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
          >
            {medias.map((media, index) => (
              <MenuItem key={index} value={media}>
                {media}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.link && formik.errors.link) ||
              (error && errorMessage.link)
                ? true
                : false
            }
            id="link"
            name="link"
            label="link"
            helperText={
              formik.touched.link && formik.errors.link
                ? formik.errors.link
                : error && errorMessage.link
                ? errorMessage.link[0]
                : null
            }
            value={formik.values.link}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-link"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.link && formik.errors.link) ||
                (error && errorMessage.link) ? (
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
