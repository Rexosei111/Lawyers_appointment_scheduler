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
  certs,
}) {
  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={0}
      // variant={"outlined"}
      padding={2}
    >
      <Typography variant="h4">
        {first_name + " " + other_names + " " + last_name}
      </Typography>
      <Breadcrumbs separator=".">
        {certs.map((option, index) => (
          <Typography variant="caption" key={index}>
            {option.type_of_lawyer}
          </Typography>
        ))}
      </Breadcrumbs>

      <>
        <Typography variant="body2" component={"div"} mt={1}>
          {biography}
        </Typography>
      </>
    </Grid>
  );
}
