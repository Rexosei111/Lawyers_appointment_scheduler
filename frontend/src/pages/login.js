import { Alert, AlertTitle, Paper, Typography, useMediaQuery } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/loginForm";

function Login() {
  const small = useMediaQuery("(max-width:500px)");
  const [status, setStatus] = useState(null)

  return (
    <>
    {status &&
      <Alert severity={status === 400 ? "error" : "warning"} sx={{ mb: 2}}>
        <AlertTitle>{status === 400 ? "Incorrect Credentials" : "Email not verifiied"}</AlertTitle>
        {status === 400 ? "Your Email or Password is incorrect" : "An email has been sent to your email address to confirm your email - Check it out!"}
      </Alert>
      }
      <Paper
        variant="elevation"
        elevation={3}
        sx={{ p: small ? 2 : 4, width: small ? "100%" : null }}
      >
        <Typography variant="h4" mb={5} textAlign={"center"}>
          Login into your account
        </Typography>
        <LoginForm setStatus={setStatus} />
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
