import React, { createContext, useEffect, useState } from "react";
import RegisterForm from "../components/auth/registerForm";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Alert, AlertTitle, Container } from "@mui/material";
import OtherInfoForm from "../components/auth/other-info-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Category from "../components/auth/category";

const steps = ["Personal Information", "Other personal info", "Type of Lawyer"];

const formIds = ["first", "second", "third"];

export const registerContext = createContext();
export default function Register() {
  const [params] = useSearchParams();
  const [activeStep, setActiveStep] = React.useState(
    params.get("tabIndex") ? +params.get("tabIndex") : 0
  );
  const [skipped, setSkipped] = React.useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(true);
  const navigate = useNavigate();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (activeStep !== 0) {
      navigate(`?tabIndex=${activeStep}`);
    }
    if (activeStep === 0) navigate(``);
  }, [activeStep, navigate]);

  const stepContent = [
    <RegisterForm
      setLoading={setLoading}
      setError={setError}
      error={error}
      handleNext={handleNext}
      setVerified={setVerified}
    />,
    <OtherInfoForm
      setLoading={setLoading}
      setError={setError}
      error={error}
      handleNext={handleNext}
    />,
    <Category
      setLoading={setLoading}
      setError={setError}
      error={error}
      handleNext={handleNext}
    />,
  ];
  return (
    <Container maxWidth="md">
      {verified === false && (
        <Alert severity="info" sx={{ my: 2 }}>
          <AlertTitle>{"Email Verification"}</AlertTitle>
          An email has been sent to your email address -{" "}
          <strong>Check it out!</strong>
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" my={2}>
          Create an Account
        </Typography>
        <Typography
          component={Link}
          to="/auth/login"
          color={"GrayText"}
          variant="caption"
        >
          Log into your account
        </Typography>
      </Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box> */}
          {navigate("/auth/login")}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box
            sx={{
              widht: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            {stepContent[activeStep]}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <LoadingButton
              variant="contained"
              type="submit"
              endIcon={<SaveIcon />}
              loadingPosition="end"
              loading={loading}
              sx={{
                bgcolor: error && "#fd251a",
                "&:hover": {
                  bgcolor: error && "#fd251a90",
                },
                ml: "auto",
              }}
              form={formIds[activeStep]}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </LoadingButton>
          </Box>
        </React.Fragment>
      )}
    </Container>
  );
}
