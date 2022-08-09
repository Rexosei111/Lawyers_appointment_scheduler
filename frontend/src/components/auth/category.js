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
  type_of_lawyer: "",
  certificate: "",
  years_of_experience: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.type_of_lawyer) {
    errors.type_of_lawyer = "Required Field";
  }

  if (!values.years_of_experience) {
    errors.years_of_experience = "Required Field";
  } else if (values.years_of_experience < 0) {
    errors.years_of_experience = "This field cannot be negetive";
  }
  //   if (!values.certificate) {
  //     errors.certificate = "Required Field";
  //   }

  return errors;
};

const type_of_lawyers = [
  { label: "Bankruptcy", value: "Bankruptcy" },
  { label: "Business", value: "Business" },
  { label: "Constitutional", value: "Constitutional" },
  { label: "Criminal Defense", value: "Criminal Defense" },
  { label: "Employment and Labor", value: "Employment and Labor" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Estate Planning", value: "Estate Planning" },
  { label: "Family", value: "Family" },
  { label: "Immigration", value: "Immigration" },
  { label: "Intellectual Property", value: "Intellectual Property" },
  { label: "Personal Injury", value: "Personal Injury" },
  { label: "Tax", value: "Tax" },
];

function Category({ setLoading, error, setError, handleNext }) {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
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
      setLoading(true);
      try {
        const { data } = await API.post(
          "lawyers/me/category",
          { ...values, certificate: Link },
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
        setToken(data);
        setLoading(false);
        setSuccess(true);
        setError(false);
        handleNext();
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

  const handleCertChange = (e) => {
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
            select
            error={
              (formik.touched.type_of_lawyer && formik.errors.type_of_lawyer) ||
              (error && errorMessage.type_of_lawyer)
                ? true
                : false
            }
            id="type_of_lawyer"
            name="type_of_lawyer"
            label="Type of Lawyer"
            helperText={
              formik.touched.type_of_lawyer && formik.errors.type_of_lawyer
                ? formik.errors.type_of_lawyer
                : error && errorMessage.type_of_lawyer
                ? errorMessage.type_of_lawyer[0]
                : null
            }
            value={formik.values.type_of_lawyer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-type_of_lawyer"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.type_of_lawyer &&
                  formik.errors.type_of_lawyer) ||
                (error && errorMessage.type_of_lawyer) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          >
            {type_of_lawyers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            error={
              (formik.touched.certificate && formik.errors.certificate) ||
              (error && errorMessage.certificate)
                ? true
                : false
            }
            id="certificate"
            name="certificate"
            label="Certificate"
            helperText={
              formik.touched.certificate && formik.errors.certificate
                ? formik.errors.certificate
                : error && errorMessage.certificate
                ? errorMessage.certificate[0]
                : null
            }
            value={Link}
            onChange={handleCertChange}
            // onBlur={formik.handleBlur}
            placeholder=""
            autoComplete="current-certificate"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.certificate && formik.errors.certificate) ||
                (error && errorMessage.certificate) ? (
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
              (formik.touched.years_of_experience &&
                formik.errors.years_of_experience) ||
              (error && errorMessage.years_of_experience)
                ? true
                : false
            }
            id="years_of_experience"
            name="years_of_experience"
            label="years_of_experience"
            type="number"
            helperText={
              formik.touched.years_of_experience &&
              formik.errors.years_of_experience
                ? formik.errors.years_of_experience
                : error && errorMessage.years_of_experience
                ? errorMessage.years_of_experience[0]
                : null
            }
            value={formik.values.years_of_experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="current-years_of_experience"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.years_of_experience &&
                  formik.errors.years_of_experience) ||
                (error && errorMessage.years_of_experience) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          />
        </div>
      </form>
    </Paper>
  );
}

export default Category;
