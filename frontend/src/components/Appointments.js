import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../lib/Axios_init";
import { truncateText } from "../utils";
import ResponsiveAppBar from "./TopNav";

export default function Appointments() {
  const [appointment, setAppointment] = useState(null);
  const [fetching, setFetching] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const cancelAppointment = async () => {
    await API.delete(`appointments/${params.id}`);
    navigate("/lawyers");
  };

  const completeAppointment = async () => {
    await API.patch(`appointments/${params.id}`);
    setAppointment((prevState) => ({
      ...prevState,
      status: "Completed",
    }));
  };
  useEffect(() => {
    async function viewAppointment() {
      setFetching(true);
      try {
        const { data } = await API.get(`appointments/${params.id}`);
        setAppointment(data);
        setFetching(false);
      } catch (error) {
        setFetching(false);
        if (error.response.status === 404) {
          setError(true);
        }
      }
    }
    viewAppointment();
  }, [params]);

  return (
    <>
      <ResponsiveAppBar />
      <Container>
        {fetching ? (
          <Typography variant="h6" color="GrayText">
            Fetching...
          </Typography>
        ) : error ? (
          <>
            <Typography variant="h4" textAlign={"center"}>
              Unable to Fetch Appointment Details
            </Typography>
            <Typography variant="body1" textAlign={"center"}>
              It may have been deleted
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5">
              Appointment with{" "}
              {appointment.lawyer.first_name +
                " " +
                appointment.lawyer.last_name}
            </Typography>
            <Grid
              container
              spacing={2}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
            >
              <Grid item xs={12} md={6}>
                <Card elevation={0}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: blueGrey[500], height: 70, width: 70 }}
                        src={appointment.lawyer.picture}
                      >
                        {appointment.lawyer.first_name.charAt(0)}
                      </Avatar>
                    }
                    title={`${appointment.lawyer.first_name} ${appointment.lawyer.other_names} ${appointment.lawyer.last_name}`}
                    titleTypographyProps={{
                      variant: "body1",
                    }}
                    subheader={
                      <Breadcrumbs separator="-">
                        {appointment.lawyer.category_set.map((item, index) => (
                          <Typography variant="caption" key={index}>
                            {item.type_of_lawyer}
                          </Typography>
                        ))}
                      </Breadcrumbs>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {truncateText(appointment.lawyer.biography)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/lawyers/profile/${appointment.lawyer.id}`}
                    >
                      View Profile
                    </Button>
                  </CardActions>
                </Card>
                <Typography variant="h6" mt={2}>
                  Your details
                </Typography>
                <Card elevation={0} sx={{ mt: 1 }}>
                  <CardHeader
                    title={`${appointment.name}`}
                    titleTypographyProps={{
                      variant: "body1",
                    }}
                    subheader={
                      <Breadcrumbs separator="-">
                        <Typography variant="caption">
                          {appointment.email}
                        </Typography>
                        <Typography variant="caption">
                          {appointment.location}
                        </Typography>
                      </Breadcrumbs>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {appointment.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ width: "fit-content" }}>
                  <CardHeader
                    title={`Appointment Date: ${new Date(
                      appointment.booking_date
                    ).toDateString()}`}
                    subheader={
                      <Stack
                        direction={"row"}
                        alignItems="center"
                        justifyContent={"space-between"}
                      >
                        <Typography>{`Status : ${appointment.status}`}</Typography>
                        <Typography>{`Time : ${appointment.appointment_time}`}</Typography>
                      </Stack>
                    }
                  />
                  <CardActions>
                    {appointment.status === "Accepted" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={cancelAppointment}
                      >
                        Cancel Appointment
                      </Button>
                    )}
                    {new Date(appointment.booking_date) - new Date() <= 0 &&
                      appointment.status === "Accepted" && (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={completeAppointment}
                        >
                          mark as completed
                        </Button>
                      )}
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
