import { IconButton, Paper, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import { API } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditBio({ setEdit, setBio, bio }) {
  const [newBio, setNewBio] = useState(bio);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);

  const navigate = useNavigate();
  const handleChange = (event) => {
    setNewBio(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newBio === null) {
      setErrorMessage("This field cannot be null");
      return null;
    }
    try {
      const { data } = await API.post(
        "lawyers/me/bio",
        { Biography: newBio },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      setBio(data.Bio);
      setEdit(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 401) {
        navigate("/auth/login");
      }
      setEdit(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };
  return (
    <Paper
      elevation={0}
      //   variant="outlined"
      component={"form"}
      onSubmit={handleSubmit}
      method="POST"
      action="#"
    >
      <TextField
        fullWidth
        onChange={handleChange}
        multiline
        rows={3}
        value={newBio}
        helperText={error && errorMessage}
        error={error}
      />
      <Stack flexDirection={"row"} alignItems="center" ml={"auto"}>
        <IconButton type="submit">
          <DoneIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleCancel}>
          <CancelIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}
