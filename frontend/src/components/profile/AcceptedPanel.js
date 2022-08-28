import { Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppointmentDetails from "./AppointmentDetails";
import BookingCard from "./BookingCard";

export default function AcceptedPanel({ bookings, updateBookings }) {
  const [activeBooking, setActiveBooking] = useState(
    bookings.filter(({ status }) => status === "Accepted")[0]
  );
  useEffect(() => {
    setActiveBooking(bookings.filter(({ status }) => status === "Accepted")[0]);
  }, [bookings]);
  return (
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
            booking.status === "Accepted" && (
              <Grid item sx={12} xl={6} key={booking.id}>
                <BookingCard
                  booking={booking}
                  setActiveBooking={setActiveBooking}
                />
              </Grid>
            )
        )}
      </Grid>
      <AppointmentDetails
        activeBooking={activeBooking}
        updateBookings={updateBookings}
      />
    </Stack>
  );
}
