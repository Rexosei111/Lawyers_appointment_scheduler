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
import { API } from "../../lib/Axios_init";
import DropArea from "../DropArea";
import Uploading from "../uploading";
import AfterUpload from "../AfterUpload";
import { MuiTelInput } from "mui-tel-input";
import PersonIcon from "@mui/icons-material/Person";
import { useLocalStorage } from "../../hooks/storage";

const initialValues = {
  other_names: "",
  phone_number: "",
  picture: "",
  gender: "",
};

const validate = (values) => {
  let errors = {};

  // if (!values.picture) {
  //   errors.picture = "Required Field";
  // }
  if (!values.gender) {
    errors.gender = "Required Field";
  }

  return errors;
};

function OtherInfoForm({ setLoading, handleNext, error, setError }) {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState(null);
  const [message, setmessage] = useState();
  const [severity, setSeverity] = useState("error");
  const [File, setFile] = useState(null);
  const [Link, setLink] = useState("");
  const [status, setstatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [phnumber, setNumber] = useState("");
  const large = useMediaQuery("(max-width:900px)");
  const formRef = useRef();

  const handlephnumberChnage = (newValue, info) => {
    setNumber(info.numberValue);
  };
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  const [token, setToken] = useLocalStorage("token", null);
  const [otherInfo, setOtherInfo] = useLocalStorage("otherInfo", {});

  const small = useMediaQuery("(max-width:500px)");
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      const allValues = { ...values, picture: Link, phone_number: phnumber };
      setOtherInfo(allValues);
      try {
        const { data } = await API.patch("lawyers/me", allValues, {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
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

  useEffect(() => {
    if (File !== null) {
      setstatus("uploading");
    }
  }, [File]);

  const genders = [
    {
      label: "Male",
      value: "MALE",
    },
    { label: "Female", value: "FEMALE" },
  ];
  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ p: 2, width: small ? "100%" : null }}
    >
      <form
        action="#"
        method="PATCH"
        id="second"
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
              (formik.touched.other_names && formik.errors.other_names) ||
              (error && errorMessage.other_names)
                ? true
                : false
            }
            id="other_names"
            name="other_names"
            label="Other Names"
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
            autoComplete="current-picture"
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
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <MuiTelInput
            onlyCountries={["GH"]}
            defaultCountry="GH"
            error={
              (formik.touched.phone_number && formik.errors.phone_number) ||
              (error && errorMessage.phone_number)
                ? true
                : false
            }
            id="phone_number"
            name="phone_number"
            label="Phone Number"
            helperText={
              formik.touched.phone_number && formik.errors.phone_number
                ? formik.errors.phone_number
                : error && errorMessage.phone_number
                ? errorMessage.phone_number[0]
                : null
            }
            value={phnumber}
            onChange={handlephnumberChnage}
            // onBlur={formik.handleBlur}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.phone_number && formik.errors.phone_number) ||
                (error && errorMessage.phone_number) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            fullWidth
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Typography variant="caption" color={"GrayText"}>
            Profile Picture
          </Typography>
          {status === "done" && (
            <AfterUpload
              link={Link}
              setLink={setLink}
              setFile={setFile}
              setstatus={setstatus}
            />
          )}
          {status === "uploading" && (
            <Uploading File={File} setLink={setLink} setstatus={setstatus} />
          )}
          {status === null && (
            <Box>
              <DropArea
                setFile={setFile}
                setOpen={setOpen}
                open={open}
                message={message}
                setmessage={setmessage}
              />
              <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <label htmlFor="image">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  disableElevation
                  sx={{ my: 1 }}
                >
                  Choose a file
                </Button>
              </label>
            </Box>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextField
            select
            error={
              (formik.touched.gender && formik.errors.gender) ||
              (error && errorMessage.gender)
                ? true
                : false
            }
            id="gender"
            name="gender"
            type="text"
            label="Sex"
            helperText={
              formik.touched.gender && formik.errors.gender
                ? formik.errors.gender
                : error && errorMessage.gender
                ? errorMessage.gender[0]
                : null
            }
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="M / F"
            autoComplete="current-gender"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
              endAdornment:
                (formik.touched.gender && formik.errors.gender) ||
                (error && errorMessage.gender) ? (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                ) : undefined,
            }}
            sx={{ mr: "auto" }}
          >
            {genders.map((gender) => (
              <MenuItem key={gender.value} value={gender.value}>
                {gender.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </form>
    </Paper>
  );
}

export default OtherInfoForm;
