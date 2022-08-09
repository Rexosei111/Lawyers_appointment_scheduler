import { Paper, Typography, useMediaQuery } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/loginForm";

function Login() {
  const small = useMediaQuery("(max-width:500px)");

  return (
    <>
      <Paper
        variant="elevation"
        elevation={3}
        sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}
      >
        <Typography variant="h4" mb={5} textAlign={"center"}>
          Login into your account
        </Typography>
        <LoginForm />
        <Typography
          variant="caption"
          color={"GrayText"}
          component={Link}
          to="/auth/register"
        >
          Create new account?
        </Typography>
      </Paper>
    </>
  );
}

export default Login;
