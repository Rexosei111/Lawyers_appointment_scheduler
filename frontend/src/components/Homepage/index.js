import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import heroBg from "../../assets/court-2.jpg";
import ResponsiveAppBar from "../TopNav";
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import MonitizationOn from "@mui/icons-material/MonetizationOn";
import Diversity1Icon from "@mui/icons-material/FamilyRestroom";
import Psychology from "@mui/icons-material/Psychology";
import BusinessIcon from "@mui/icons-material/Business";
import { API } from "../../lib/Axios_init";

const icons = {
  Bankruptcy: {
    icon: <MonitizationOn fontSize="large" />,
  },
  Family: { icon: <Diversity1Icon fontSize="large" /> },
  Entertainment: { icon: <Psychology fontSize="large" /> },
  Business: { icon: <BusinessIcon fontSize="large" /> },
};

export default function Index() {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function get_summary() {
      const { data } = await API.get("summary");
      console.log(data);
      setData(data);
    }
    get_summary();
  }, []);
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
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/lawyers/"
          >
            Book an Appointment
          </Button>
          {data && (
            <Stack
              mt={4}
              component={Paper}
              direction={"row"}
              sx={{
                "& .first": {
                  bgcolor: "#ff9800",
                },
              }}
            >
              {Object.entries(data).map((name, index) => (
                // <>
                <Stack
                  className={index === 0 && "first"}
                  key={name}
                  direction={"column"}
                  spacing={2}
                  alignItems={"center"}
                  component={Paper}
                  px={2}
                  padding={3}
                  width={170}
                >
                  <Typography
                    variant="body1"
                    color={index === 0 ? "white" : "black"}
                    // bgcolor="white !important"
                  >
                    {name[0]}
                  </Typography>
                  {/* {icons[name].icon} */}
                  <Diversity1Icon fontSize="large" />

                  <Typography variant="body1">{name[1]} lawyers</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Container>
      </Paper>
    </>
  );
}
