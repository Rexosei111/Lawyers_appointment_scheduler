import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  Divider,
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
import testimonialBg from "../../assets/testimonial.svg";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddCert from "./addCert";
import TestimonialForm from "./testimonialForm";
import { truncateText } from "../../utils";

export default function Testimonials() {
  const [open, setOpen] = useState(false);
  const [testimonials, setTestimonials] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  useEffect(() => {
    async function gettestimonials() {
      try {
        const { data } = await API.get("lawyers/me/testimonials", {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        setTestimonials(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    }
    gettestimonials();
  }, [navigate, token]);

  const deletetestimonial = (id) => {
    async function removeCert() {
      try {
        await API.delete(`lawyers/me/testimonials/${id}`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });

        setTestimonials((prevState) =>
          prevState.filter((item) => item.id !== id)
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    }
    removeCert();
  };

  return (
    <>
      <Grid
        item
        xs={12}
        component={Paper}
        elevation={0}
        variant="outlined"
        padding={2}
        my={2}
      >
        <Stack flexDirection={"row"}>
          <Typography variant="h5" mb={0}>
            Testimonials
          </Typography>
          <IconButton
            size="large"
            onClick={handleToggle}
            sx={{ ml: "auto", backgroundColor: grey[200] }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" mb={0} color={"GrayText"}>
          Edorsement from previous client
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            {testimonials === null || testimonials.length === 0 ? (
              <img
                src={testimonialBg}
                alt=""
                height={340}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <List dense={true}>
                {testimonials.map((testimonial, index) => (
                  <ListItem disableGutters key={index}>
                    <ListItemIcon>
                      <IconButton
                        onClick={() => deletetestimonial(testimonial.id)}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText
                      primary={testimonial.name}
                      secondary={
                        <Stack>
                          <Breadcrumbs separator="~" sx={{ width: "100%" }}>
                            <Typography
                              variant="caption"
                              // to={testimonial.testimonialificate}
                            >
                              {testimonial.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color={"GrayText"}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {testimonial.company}
                            </Typography>
                          </Breadcrumbs>
                          <Typography variant="caption">
                            {truncateText(testimonial.testimony)}
                          </Typography>
                        </Stack>
                      }
                    ></ListItemText>
                  </ListItem>
                ))}
              </List>
            )}

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alginItems: "center",
                justifyContent: "center",
              }}
            >
              {testimonials && testimonials.length === 0 && (
                <Typography
                  variant="caption"
                  color={"GrayText"}
                  textAlign={"center"}
                  my={1}
                >
                  Showcase your work with client outside of this platform.
                </Typography>
              )}
              <Button>Request a testimonial</Button>
            </Box>
          </Box>
          {/* <img src={testimonialBg} alt="" height={340} />
        <Typography
        variant="caption"
        color={"GrayText"}
        textAlign={"center"}
        my={1}
        >
          Showcase your work with client outside of this platform.
          </Typography>
        <Button>Request a testimonial</Button> */}
        </Box>
      </Grid>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleClose}
        // sx={{ color: "#00000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <TestimonialForm
          setTestimonials={setTestimonials}
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
}
