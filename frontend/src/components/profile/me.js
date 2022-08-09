import { Avatar, Divider, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import Certificates from "./certificate";
import Info from "./info";
import Profile from "./profile";
import SocialMedia from "./socialMedia";
import Testimonials from "./testimonials";

export default function Me() {
  const [token, setToken] = useLocalStorage("token", null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setFetching(true);
      try {
        const { data } = await API.get("lawyers/me", {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        setPersonalInfo(data);
        // console.log(data);
        setFetching(false);
      } catch (error) {
        setFetching(false);

        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            console.log(error.status);
            navigate("/auth/login");
          }
        }
      }
    }
    fetchProfile();
  }, [navigate, token.access]);

  return (
    <>
      {fetching ? (
        <Typography>Fetching...</Typography>
      ) : personalInfo !== null ? (
        <Grid
          container
          spacing={2}
          // justifyContent={"center"}
          alignItems={"flex-start"}
        >
          <Grid container item xs={12} sm={12} md={12} lg={3}>
            <Grid item xs={12}>
              <Avatar
                alt="profile picture"
                sx={{ height: 150, width: 150 }}
                src={personalInfo.picture}
              />
            </Grid>
            <Info personalInfo={personalInfo} />
            <SocialMedia />
          </Grid>
          <Grid container item xs={12} lg={9}>
            <Profile
              first_name={personalInfo.first_name}
              other_names={personalInfo.other_names}
              last_name={personalInfo.last_name}
            />
            <Testimonials />
            <Certificates />
          </Grid>
        </Grid>
      ) : (
        <Typography>Nothing to show</Typography>
      )}
    </>
  );
}
