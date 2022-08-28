import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import CancelIcon from "@mui/icons-material/Cancel";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { API } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function AppointmentDetails({ updateBookings, activeBooking }) {
  const [note, setNote] = useState(null);
  const [active, setActive] = useState(false);
  const [cancelled, setCancelled] = useState(null);
  const [time, setTime] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleActive = (e) => {
    setActive(true);

    setCancelled(e.target.value === "true");
  };

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  useEffect(() => {
    if (time === null) {
      setError("Required Field");
    }
  }, [time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (cancelled === false && time === null) {
      setError("This field is required");
      return;
    }
    const date = new Date(time);
    const newTime = `${date.getHours()}:${date.getMinutes()}`;
    const values = { note, time: newTime, Cancel: cancelled };
    try {
      const { data } = await API.patch(
        `lawyers/me/booking/${activeBooking.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      updateBookings(activeBooking.id, {
        status: cancelled ? "Declined" : "Accepted",
        appointment_time: data.time,
      });
      setActive(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response.status === 401) {
        navigate("/auth/login");
      }
    }
  };
  return (
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
            <Typography variant="caption">{activeBooking.email}</Typography>
            <Typography variant="caption">{activeBooking.location}</Typography>
          </Breadcrumbs>
        }
      />
      <CardContent>
        <Typography>{activeBooking.description}</Typography>
        <Stack mt={2} direction={"row"} spacing={1}>
          <EventIcon fontSize={"small"} />
          <Typography variant="caption" mr={"auto"}>
            Appointment Date:{" "}
            {new Date(activeBooking.booking_date).toDateString()}
          </Typography>

          <Typography variant="caption" ml={"auto"}>
            Time: {activeBooking.appointment_time}
          </Typography>
        </Stack>
        {active && (
          <>
            {cancelled === false && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={time}
                  onChange={(newValue) => {
                    setTime(newValue);
                  }}
                  helperText={error && error}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            )}
            <form method="POST" action="#" id="Pform" onSubmit={handleSubmit}>
              <TextField
                sx={{ mt: 2 }}
                multiline
                fullWidth
                rows={5}
                placeholder={`Message for ${activeBooking.name}`}
                value={note}
                onChange={handleChange}
              />
            </form>
          </>
        )}
      </CardContent>
      <CardActions>
        {active ? (
          <>
            <Button
              variant="outlined"
              color="warning"
              sx={{ ml: "auto" }}
              onClick={() => {
                setActive(false);
                setNote(null);
                setCancelled(null);
                setTime(null);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="success"
              type="submit"
              form="Pform"
            >
              Confirm
            </LoadingButton>
          </>
        ) : (
          <>
            <Button
              sx={{ ml: "auto" }}
              variant={"contained"}
              onClick={handleActive}
              value={false}
              size="small"
            >
              Change Appointment Time
            </Button>
            <Button
              variant={"outlined"}
              color={"error"}
              endIcon={<CancelIcon fontSize="small" />}
              onClick={handleActive}
              value={true}
              size="small"
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
