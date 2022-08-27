import {
  Avatar,
  Button,
  Dialog,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import Certificates from "./Certs";
import Info from "../profile/info";
import Profile from "../profile/profile";
import SocialMedia from "../profile/socialMedia";
import Testimonials from "../profile/testimonials";
import Details from "./Detais";
import BookingForm from "./bookingForm";

export default function PublicProfile() {
  const [token, setToken] = useLocalStorage("token", null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    async function fetchProfile() {
      setFetching(true);
      try {
        const { data } = await API.get(`lawyers/profile/${params.id}`, {
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
  }, [navigate, params.id, token.access]);

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
            <Button
              sx={{ ml: "auto", my: 2 }}
              variant="contained"
              onClick={handleOpen}
            >
              Book Appointment
            </Button>
            <Dialog open={open} keepMounted onClose={handleClose}>
              <BookingForm />
            </Dialog>
            <Details
              first_name={personalInfo.first_name}
              other_names={personalInfo.other_names}
              last_name={personalInfo.last_name}
              biography={personalInfo.biography}
            />
            {/* <Testimonials /> */}
            <Certificates email={personalInfo.email} />
          </Grid>
        </Grid>
      ) : (
        <Typography>Nothing to show</Typography>
      )}
    </>
  );
}
