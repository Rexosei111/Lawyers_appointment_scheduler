import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import EditBio from "./editBio";

export default function Profile({
  first_name,
  other_names,
  last_name,
  biography,
  categories,
}) {
  const [bio, setBio] = useState(biography);
  const [edit, setEdit] = useState(false);

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
      <Breadcrumbs separator="/">
        {categories.map((option, index) => (
          <Typography variant="caption" key={index}>
            {option.type_of_lawyer}
          </Typography>
        ))}
      </Breadcrumbs>
      <Box sx={{ width: "100%" }}>
        {edit ? (
          <EditBio setEdit={setEdit} bio={bio} setBio={setBio} />
        ) : bio === null ? (
          <Button variant="outlined" onClick={() => setEdit(true)}>
            Add A bio
          </Button>
        ) : (
          <>
            <Typography variant="body2" component={"div"} my={2} lineHeight={2}>
              {bio}
            </Typography>
            <Button variant="outlined" onClick={() => setEdit(true)}>
              Edit
            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
}
