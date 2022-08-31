import {
  Dialog,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WcIcon from "@mui/icons-material/Wc";
import AddIcon from "@mui/icons-material/Edit";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import UpdateInfo from "./updateInfo";

export default function Info({ personalInfo, setPersonalInfo }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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
        <IconButton
          sx={{ ml: "auto", backgroundColor: grey[200] }}
          onClick={handleToggle}
        >
          <AddIcon fontSize="small" />
        </IconButton>
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
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleClose}
        // sx={{ color: "#00000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <UpdateInfo
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          handleClose={handleClose}
        />
      </Dialog>
    </Grid>
  );
}
