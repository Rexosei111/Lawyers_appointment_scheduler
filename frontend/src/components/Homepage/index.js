import React from "react";
import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import heroBg from "../../assets/court-2.jpg";
import ResponsiveAppBar from "../TopNav";
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import OneK from "@mui/icons-material/OneK"
import MonitizationOn from "@mui/icons-material/MonetizationOn"
import Diversity1Icon from "@mui/icons-material/FamilyRestroom"
import Psychology from "@mui/icons-material/Psychology"
import BusinessIcon from "@mui/icons-material/Business"

export default function Index() {
  return (
    <>
    <Paper
    elevation={0}
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundImage: `url(${heroBg})`,
        backgroundBlendMode: "overlay",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      >
      <ResponsiveAppBar />
      <Container
        sx={{
          height: "89vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        >
        <Typography variant="h2" textAlign={"center"} my={2} color={"white"}>
          Looking for an Attorney?{" "}
          <Typography variant="h5">
            We have various Attorneys, who are highly capable of handling any
            issue for you. Just book an appointment.
          </Typography>
        </Typography>
        <Button variant="contained" size="large" component={Link} to="/lawyers/">
          Book an Appointment
        </Button>
      <Stack mt={4} component={Paper} direction={"row"}>
        <Stack direction={"column"} spacing={2} alignItems={"center"} px={2} padding={3} width={150} bgcolor={"#ff9800"}>
          <Typography variant="body2" color={"white"}>Bankruptcy</Typography>
          <MonitizationOn fontSize="large" />
          <Typography variant="caption" color={"white"}>22 lawyers</Typography>
        </Stack>
        <Divider orientation="vertical"/>
        <Stack direction={"column"} spacing={2} padding={3} alignItems={"center"} px={2} width={150} sx={{
          
        }}>
          <Typography variant="body2">Family</Typography>
          <Diversity1Icon fontSize="large" />
          <Typography variant="caption" color={"GrayText"}>13 lawyers</Typography>
        </Stack>
        <Divider orientation="vertical"/>
        <Stack direction={"column"} spacing={2} padding={3} alignItems={"center"} px={2} width={150}>
          <Typography variant="body2">Intellectual</Typography>
          <Psychology fontSize="large" />
          <Typography variant="caption" color={"GrayText"}>15 lawyers</Typography>
        </Stack>
        <Divider orientation="vertical"/>
        <Stack direction={"column"} spacing={2} alignItems={"center"} px={2} padding={3} width={150}>
          
          <Typography variant="body2">Business</Typography>
          <BusinessIcon fontSize="large" />
          <Typography variant="caption" color={"GrayText"}>34 lawyers</Typography>
        </Stack>
        {/* <Divider orientation="vertical"/> */}
      </Stack>
      </Container>
    </Paper>
    <Container>
    </Container>
        </>
  );
}
