import React from "react";
import { Button, Container, Paper, Typography } from "@mui/material";
import heroBg from "../../assets/court-2.jpg";
import ResponsiveAppBar from "../TopNav";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <Paper
      sx={{
        width: "100%",
        height: 500,
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
          height: "inherit",
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
        <Button variant="contained" component={Link} to="/lawyers/">
          Book an Appointment
        </Button>
      </Container>
    </Paper>
  );
}
