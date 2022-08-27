import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

export default function BookingCard({ booking, setActiveBooking }) {
  return (
    <Card
      elevation={0}
      //   variant={"outlined"}
      //   sx={{ width: { sx: "100%", md: "50%" } }}
      onClick={() => setActiveBooking(booking)}
    >
      <CardActionArea>
        <CardHeader
          title={
            <Stack direction={"row"} alignItems="center">
              <Typography>{booking.name}</Typography>
              <Typography variant="body2" ml={"auto"}>
                {new Date(booking.created_at).toDateString()}
              </Typography>
            </Stack>
          }
          subheader={
            <Breadcrumbs separator="-">
              <Typography variant="caption">{booking.email}</Typography>
              <Typography variant="caption">{booking.location}</Typography>
            </Breadcrumbs>
          }
        />
        <CardContent>
          <Typography>{booking.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
