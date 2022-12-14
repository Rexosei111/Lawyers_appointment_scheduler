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
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import SocialForm from "./SocialForm";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SocialMedia() {
  const [token, setToken] = useLocalStorage("token", null);
  const [open, setOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function get_links() {
      try {
        const { data } = await API.get(`/lawyers/me/links`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        setSocialLinks(data);
        console.log(data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate(`/auth/login`);
        }
      }
    }
    get_links();
  }, [navigate, token.access]);
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
        <IconButton
          sx={{ ml: "auto", backgroundColor: grey[200] }}
          onClick={handleToggle}
        >
          <AddIcon fontSize="small" />
        </IconButton>
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
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <SocialForm setSocialLinks={setSocialLinks} handleClose={handleClose} />
      </Dialog>
    </Grid>
  );
}
