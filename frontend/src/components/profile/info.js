import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WcIcon from "@mui/icons-material/Wc";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Info({ personalInfo }) {
  return (
    <Grid
      item
      my={2}
      xs={12}
      component={Paper}
      elevation={0}
      variant={"outlined"}
      sx={{ p: 2 }}
    >
      <Typography variant="caption" color={"GrayText"} my={2}>
        Info
      </Typography>
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
      {/* <Typography variant="h6">
        {personalInfo.first_name} {personalInfo.other_names.charAt(0)}.{" "}
        {personalInfo.last_name}
      </Typography> */}
      {/* <Typography variant="body2" my={1}>
        {personalInfo.email}
      </Typography> */}
      {/* <Typography variant="body2" my={1}>
        {personalInfo.phone_number}
      </Typography> */}
      {/* <Typography variant="caption" my={1}>
        {personalInfo.gender}
      </Typography> */}
    </Grid>
  );
}
