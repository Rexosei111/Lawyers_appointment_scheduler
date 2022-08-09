import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const links = {
  facebook: {
    key: "Facebook",
    icon: <FacebookIcon fontSize="small" />,
  },
  linkedIn: {
    key: "LinkedIn",
    icon: <LinkedInIcon fontSize="small" />,
  },
  twitter: {
    key: "Twitter",
    icon: <TwitterIcon fontSize="small" />,
  },
};

const myLinks = [
  {
    name: "facebook",
    link: "http://facebook.com",
  },
  {
    name: "linkedIn",
    link: "http://linked.in.com",
  },
];
export default function SocialMedia() {
  return (
    <Grid
      item
      my={2}
      xs={12}
      component={Paper}
      elevation={0}
      variant="outlined"
      sx={{ p: 2 }}
    >
      <Typography variant="caption" color={"GrayText"} my={2}>
        Social Links
      </Typography>
      <List disablePadding={true}>
        {myLinks.map((option, index) => (
          <ListItem disableGutters disablePadding key={index}>
            <ListItemIcon>{links[option.name].icon}</ListItemIcon>
            <ListItemText primary={option.link} sx={{ ml: -2 }} />
          </ListItem>
        ))}
      </List>
    </Grid>
  );
}
