import {
  alpha,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import BookingCard from "./BookingCard";
import EventIcon from "@mui/icons-material/Event";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CancelIcon from "@mui/icons-material/Cancel";

function Counter({ value = 5 }) {
  return (
    <Stack
      ml={1}
      width={(theme) => theme.spacing(3)}
      height={(theme) => theme.spacing(3)}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"50%"}
      bgcolor={"steelblue"}
      color={"white"}
    >
      <Typography variant="caption">{value}</Typography>
    </Stack>
  );
}

export default function Bookings() {
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [value, setValue] = React.useState(0);
  const [fetching, setFetching] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function get_bookings() {
      setFetching(true);
      try {
        const { data } = await API.get("lawyers/me/booking", {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        console.log(data);
        setBookings(data);
        setActiveBooking(data[0]);
        setFetching(false);
      } catch (error) {
        setFetching(false);
        if (axios.isAxiosError(error)) {
          if (error.response.status === 401) navigate("/auth/login");
          console.log(error);
        }
      }
    }
    get_bookings();
  }, [token, navigate]);

  return (
    <Stack>
      <Typography variant="h4" my={2}>
        {" "}
        Your Bookings{" "}
      </Typography>
      {fetching ? (
        <Stack
          sx={{ height: "60vh", widht: "100%" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress />
        </Stack>
      ) : bookings === null ? (
        <Stack
          sx={{ height: "60vh", widht: "100%" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h6">Unable to fetch bookings</Typography>
        </Stack>
      ) : (
        <Box
          sx={{
            maxWidth: { xs: "100%", sm: 480, md: "100%" },
            typography: "body1",
          }}
        >
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="scrollable"
              >
                <Tab
                  label="Pending"
                  value="1"
                  icon={
                    <Counter
                      value={
                        bookings.filter(({ status }) => status === "Pending")
                          .length
                      }
                    />
                  }
                  iconPosition={"end"}
                />
                <Tab
                  label="Accepted"
                  value="2"
                  icon={
                    <Counter
                      value={
                        bookings.filter(({ status }) => status === "Accepted")
                          .length
                      }
                    />
                  }
                  iconPosition={"end"}
                />
                <Tab
                  label="Declined"
                  value="3"
                  icon={
                    <Counter
                      value={
                        bookings.filter(({ status }) => status === "Declined")
                          .length
                      }
                    />
                  }
                  iconPosition={"end"}
                />
                <Tab
                  label="Completed"
                  value="4"
                  icon={
                    <Counter
                      value={
                        bookings.filter(({ status }) => status === "Completed")
                          .length
                      }
                    />
                  }
                  iconPosition={"end"}
                />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ paddingX: 0 }}>
              <Stack direction={"row"} spacing={2}>
                <Grid
                  container
                  spacing={2}
                  width={"50%"}
                  // justifyContent="center"
                  // alignItems={"flex-start"}
                >
                  {bookings.map(
                    (booking) =>
                      booking.status === "Pending" && (
                        <Grid item sx={12} xl={6} key={booking.id}>
                          <BookingCard
                            booking={booking}
                            setActiveBooking={setActiveBooking}
                          />
                        </Grid>
                      )
                  )}
                </Grid>
                <Card
                  sx={{
                    width: 500,
                    position: "sticky",
                    height: "fit-content",
                    top: ({ spacing }) => spacing(2),
                  }}
                  variant={"outlined"}
                  elevation={0}
                >
                  <CardHeader
                    title={
                      <Stack direction={"row"} alignItems="center">
                        <Typography>{activeBooking.name}</Typography>
                        <Typography variant="body2" ml={"auto"}>
                          {new Date(activeBooking.created_at).toDateString()}
                        </Typography>
                      </Stack>
                    }
                    subheader={
                      <Breadcrumbs separator="-">
                        <Typography variant="caption">
                          {activeBooking.email}
                        </Typography>
                        <Typography variant="caption">
                          {activeBooking.location}
                        </Typography>
                      </Breadcrumbs>
                    }
                  />
                  <CardContent>
                    <Typography>{activeBooking.description}</Typography>
                    <Stack mt={2} direction={"row"} spacing={1}>
                      <EventIcon fontSize={"small"} />
                      <Typography variant="caption">
                        Appointment Date:{" "}
                        {new Date(activeBooking.booking_date).toDateString()}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button
                      sx={{ ml: "auto" }}
                      variant={"contained"}
                      endIcon={<HandshakeIcon fontSize="small" />}
                    >
                      Accept
                    </Button>
                    <Button
                      variant={"outlined"}
                      color={"error"}
                      endIcon={<CancelIcon fontSize="small" />}
                    >
                      Decline
                    </Button>
                  </CardActions>
                </Card>
              </Stack>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
            <TabPanel value="4">Item Four</TabPanel>
          </TabContext>
        </Box>
      )}
    </Stack>
  );
}
