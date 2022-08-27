import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import EditBio from "./editBio";

const lawyer_types = ["Criminal", "Entertainment", "Cooperatre"];
export default function Profile({
  first_name,
  other_names,
  last_name,
  biography,
}) {
  const [fetching, setFetching] = useState(false);
  const [token, setToken] = useLocalStorage("token", null);
  const [bio, setBio] = useState(biography);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  // useEffect(() => {
  //   async function fetchProfile() {
  //     setFetching(true);
  //     try {
  //       const { data } = await API.get("lawyers/me/", {
  //         headers: {
  //           Authorization: `Bearer ${token.access}`,
  //         },
  //       });
  //       setBio(data.Bio);
  //       setFetching(false);
  //     } catch (error) {
  //       setFetching(false);

  //       if (axios.isAxiosError(error) && error.response) {
  //         if (error.response.status === 401) {
  //           navigate("/auth/login");
  //         }
  //       }
  //     }
  //   }
  //   fetchProfile();
  // }, [navigate, token.access]);

  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={0}
      variant={"outlined"}
      padding={2}
    >
      <Typography variant="h4">
        {first_name + " " + other_names + " " + last_name}
      </Typography>
      <Breadcrumbs separator=".">
        {lawyer_types.map((option, index) => (
          <Typography variant="caption" key={index}>
            {option}
          </Typography>
        ))}
      </Breadcrumbs>
      {/* <Divider orientation="horizontal" sx={{ my: 1 }} /> */}
      {/* <Typography variant="body2" color={"GrayText"}>
        Bio
      </Typography> */}
      <Box sx={{ width: "100%" }}>
        {edit ? (
          <EditBio setEdit={setEdit} bio={bio} setBio={setBio} />
        ) : bio === null ? (
          <Button variant="outlined" onClick={() => setEdit(true)}>
            Add A bio
          </Button>
        ) : (
          <>
            <Typography variant="caption" component={"div"}>
              {bio}
            </Typography>
            <Button variant="outlined" onClick={() => setEdit(true)}>
              Edit
            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
}
