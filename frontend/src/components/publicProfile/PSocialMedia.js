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
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { API } from "../../lib/Axios_init";
import { useNavigate, useParams } from "react-router-dom";

const links = {
  Facebook: {
    key: "Facebook",
    icon: <FacebookIcon fontSize="small" />,
  },
  LinkedIn: {
    key: "LinkedIn",
    icon: <LinkedInIcon fontSize="small" />,
  },
  Twitter: {
    key: "Twitter",
    icon: <TwitterIcon fontSize="small" />,
  },
};

export default function PSocialMedia() {
  const [socialLinks, setSocialLinks] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function get_links() {
      try {
        const { data } = await API.get(
          `/lawyers/profile/${params.id}/links`,
          {}
        );
        setSocialLinks(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    get_links();
  }, [params]);
  return (
    <Grid
      item
      my={2}
      xs={12}
      component={Paper}
      elevation={0}
      variant="outlined"
      sx={{ px: 2 }}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="body2" color={"GrayText"} my={2}>
          Social Links
        </Typography>
      </Stack>
      {socialLinks && (
        <List disablePadding={true}>
          {socialLinks.map((option, index) => (
            <ListItem disableGutters disablePadding key={index}>
              <ListItemIcon>{links[option.name].icon}</ListItemIcon>
              <ListItemText
                primary={option.link}
                sx={{ ml: -2 }}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Grid>
  );
}
