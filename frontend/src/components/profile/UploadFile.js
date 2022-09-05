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

const initialValues = {
  title: "",
  url: "",
  description: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.title) {
    errors.title = "Required Field";
  }

  //   if (!values.url) {
  //     errors.url = "Required Field";
  //   }

  return errors;
};

function UploadForm({ handleClose, setUploadFiles }) {
  const [formLoading, setFormLoading] = useState(false);
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

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (File !== null) {
      setFileLoading(true);
      const config = axiosConfig(setProgress);
      let Data = new FormData();
      Data.append("file", File);

      uploadAPI
        .post("upload", Data, config)
        .then((res) => {
          setLink(res.data.link);
          setFileLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setFileLoading(false);
        });
    }
  }, [File, setFileLoading]);

  const small = useMediaQuery("(max-width:500px)");
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setFormLoading(true);
      try {
        const { data } = await API.post(
          "lawyers/me/files",
          { ...values, url: Link },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
        setFormLoading(false);
        setSuccess(true);
        setError(false);
        setUploadFiles((prevState) => [...prevState, { ...data }]);
        handleClose();
        formik.values = initialValues;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage((prevState) => ({
            ...prevState,
            ...error.response.data,
          }));
        }
        setFormLoading(false);
        setSuccess(false);
        setError(true);
      }
    },
    validate,
  });

  const handleFileChange = (e) => {
    setLink(e.target.value);
  };

  return (
    <Paper
      variant="elevation"
      elevation={3}
      sx={{ p: 2, width: small ? "100%" : null }}
    >
      <form
        action="#"
        method="POST"
        id="third"
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
              (formik.touched.title && formik.errors.title) ||
              (error && errorMessage.title)
                ? true
                : false
            }
            id="title"
            name="title"
            label="Title"
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
          ></TextField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.url && formik.errors.url) ||
              (error && errorMessage.url)
                ? true
                : false
            }
            id="url"
            name="url"
            label="url"
            helperText={
              formik.touched.url && formik.errors.url
                ? formik.errors.url
                : error && errorMessage.url
                ? errorMessage.url[0]
                : null
            }
            value={Link}
            onChange={handleFileChange}
            // onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-url"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.url && formik.errors.url) ||
                (error && errorMessage.url) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          />
          <input
            type="file"
            accept="file"
            id="file"
            name="certificate"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label htmlFor="file">
            <LoadingButton
              variant="contained"
              endIcon={<SaveIcon />}
              loadingPosition="end"
              loading={loading}
              component="span"
              sx={{
                bgcolor: error && "#fd251a",
                "&:hover": {
                  bgcolor: error && "#fd251a90",
                },
                ml: "auto",
              }}
            >
              {loading ? "Uploading" : "Choose a file"}
            </LoadingButton>
            {/* <Button
              variant="contained"
              color="primary"
              component="span"
              disableElevation
              sx={{ my: 1 }}
            >
              Choose a file
            </Button> */}
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.description && formik.errors.description) ||
              (error && errorMessage.description)
                ? true
                : false
            }
            id="description"
            name="description"
            label="Description"
            placeholder="Brief description of this file."
            type="text"
            multiline
            rows={5}
            helperText={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : error && errorMessage.description
                ? errorMessage.description[0]
                : null
            }
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="current-description"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="action" />
                </InputAdornment>
              ),
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
          loading={formLoading}
          //   component="span"
          type="submit"
          sx={{
            bgcolor: error && "#fd251a",
            "&:hover": {
              bgcolor: error && "#fd251a90",
            },
            ml: "auto",
          }}
        >
          Save
        </LoadingButton>
      </form>
    </Paper>
  );
}

export default UploadForm;
