import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./TopNav";

const profileContext = createContext();
export default function ProfileLayout() {
  return (
    // <profileContext.Provider>
    <>
      <ResponsiveAppBar />
      <Container sx={{ my: 3 }}>
        <Outlet />
      </Container>
    </>
    // </profileContext.Provider>
  );
}
