import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./TopNav";

export default function Layout() {
  return (
    <Container maxWidth="xl" disableGutters>
      {/* <ResponsiveAppBar /> */}
      <Outlet />
    </Container>
  );
}
