import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WcIcon from "@mui/icons-material/Wc";

export default function PInfo({ personalInfo, setPersonalInfo }) {
  return (
    <Grid
      item
      my={2}
      xs={12}
      component={Paper}
      elevation={0}
      variant={"outlined"}
      sx={{ px: 2 }}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="body1" color={"GrayText"} my={2}>
          Info
        </Typography>
      </Stack>
      <List dense={true} disablePadding={true}>
        <ListItem disableGutters>
          <ListItemText
            primary={
              personalInfo.first_name +
              " " +
              personalInfo.other_names.charAt(0) +
              " " +
              personalInfo.last_name
            }
            primaryTypographyProps={{ variant: "h6" }}
          />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={personalInfo.email}
            primaryTypographyProps={{ variant: "body2" }}
            sx={{ ml: -2 }}
          />
        </ListItem>
        {personalInfo.phone_number && (
          <ListItem disableGutters>
            <ListItemIcon>
              <PhoneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={personalInfo.phone_number}
              primaryTypographyProps={{ variant: "body2" }}
              sx={{ ml: -2 }}
            />
          </ListItem>
        )}
        {personalInfo.gender && (
          <ListItem disableGutters>
            <ListItemIcon>
              <WcIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={personalInfo.gender}
              primaryTypographyProps={{ variant: "caption" }}
              sx={{ ml: -2 }}
            />
          </ListItem>
        )}
      </List>
    </Grid>
  );
}
