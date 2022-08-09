import { Container } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        maxWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Outlet />
    </Container>
  );
}
