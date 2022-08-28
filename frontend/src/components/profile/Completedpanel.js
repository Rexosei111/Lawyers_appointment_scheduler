import { Grid, Stack } from "@mui/material";
import React from "react";
import BookingCard from "./BookingCard";

export default function CompletedPanel({ bookings }) {
  return (
    <Stack direction={"row"} spacing={2}>
      <Grid
        container
        spacing={2}
        width={"50%"}
        justifyContent="center"
        alignItems={"flex-start"}
      >
        {bookings.map(
          (booking) =>
            booking.status === "Completed" && (
              <Grid item sx={12} xl={6} key={booking.id}>
                <BookingCard booking={booking} />
              </Grid>
            )
        )}
      </Grid>
    </Stack>
  );
}
