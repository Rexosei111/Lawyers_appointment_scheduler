import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";

const lawyer_types = ["Criminal", "Entertainment", "Cooperatre"];
export default function Details({
  first_name,
  other_names,
  last_name,
  biography,
}) {
  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={0}
      variant={"outlined"}
      padding={2}
    >
      <Typography variant="h4">
        {first_name + " " + other_names + " " + last_name}
      </Typography>
      <Breadcrumbs separator=".">
        {lawyer_types.map((option, index) => (
          <Typography variant="caption" key={index}>
            {option}
          </Typography>
        ))}
      </Breadcrumbs>
      {/* <Divider orientation="horizontal" sx={{ my: 1 }} /> */}
      {/* <Typography variant="body2" color={"GrayText"}>
          Bio
        </Typography> */}

      <>
        <Typography variant="caption" component={"div"}>
          {biography}
        </Typography>
      </>
    </Grid>
  );
}
