import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Tab,
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
import BookingDetails from "./BookingDetails";
import AcceptedPanel from "./AcceptedPanel";
import DeclinedPanel from "./DeclinedPanel";
import CompletedPanel from "./Completedpanel";

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
  const [value, setValue] = React.useState("1");
  const [fetching, setFetching] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateBookings = (id, newInfo) => {
    setBookings((prevState) => [
      ...prevState.map((state) =>
        state.id === id ? { ...state, ...newInfo } : state
      ),
    ]);
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
        setActiveBooking(data.filter(({ status }) => status === "Pending")[0]);
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

  useEffect(() => {
    if (bookings)
      setActiveBooking(
        bookings.filter(({ status }) => status === "Pending")[0]
      );
  }, [bookings]);

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
              {bookings.filter(({ status }) => status === "Pending").length >
              0 ? (
                <Stack direction={"row"} spacing={2}>
                  <Grid container spacing={2} width={"50%"}>
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
                  <BookingDetails
                    activeBooking={activeBooking}
                    updateBookings={updateBookings}
                  />
                </Stack>
              ) : (
                <Typography variant="h5" color={"GrayText"} textAlign="center">
                  No Pending Appointments
                </Typography>
              )}
            </TabPanel>
            <TabPanel value="2">
              {bookings.filter(({ status }) => status === "Accepted").length >
              0 ? (
                <AcceptedPanel
                  bookings={bookings}
                  updateBookings={updateBookings}
                />
              ) : (
                <Typography variant="h5" color={"GrayText"} textAlign="center">
                  No Accepted Appointments
                </Typography>
              )}
            </TabPanel>
            <TabPanel value="3">
              {bookings.filter(({ status }) => status === "Declined").length >
              0 ? (
                <DeclinedPanel
                  bookings={bookings}
                  updateBookings={updateBookings}
                />
              ) : (
                <Typography variant="h5" color={"GrayText"} textAlign="center">
                  No Declined Appointments
                </Typography>
              )}
            </TabPanel>
            <TabPanel value="4">
              {bookings.filter(({ status }) => status === "Completed").length >
              0 ? (
                <CompletedPanel
                  bookings={bookings}
                  updateBookings={updateBookings}
                />
              ) : (
                <Typography variant="h5" color={"GrayText"} textAlign="center">
                  No Completed Appointments
                </Typography>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      )}
    </Stack>
  );
}
