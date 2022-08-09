import {
  Backdrop,
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import certificateBg2 from "../../assets/certificateBg2.svg";
import AddIcon from "@mui/icons-material/Add";
import AddCert from "./addCert";
import { API } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ClearIcon from "@mui/icons-material/Clear";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Certificates() {
  const [open, setOpen] = useState(false);
  const [certs, setCerts] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function getCerts() {
      const { data } = await API.get("lawyers/me/category", {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      console.log(data);
      setCerts(data);
    }
    getCerts();
  }, [token]);

  const deleteCert = (id) => {
    async function removeCert() {
      const { data } = await API.delete(`lawyers/me/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      setCerts((prevState) => prevState.filter((item) => item.id !== id));
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
        <Stack flexDirection="row">
          <Typography variant="h5" mb={0}>
            Certificates
          </Typography>
          <IconButton
            size="large"
            sx={{ ml: "auto", backgroundColor: grey[200] }}
            onClick={handleToggle}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color={"GrayText"}>
          Accreditations for operation
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            width: "100%",
          }}
        >
          {certs === null || certs.length === 0 ? (
            <img
              src={certificateBg2}
              alt=""
              height={340}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <List dense={true}>
              {certs.map((cert, index) => (
                <ListItem
                  disableGutters
                  key={index}
                  secondaryAction={
                    <Stack alignItems={"center"}>
                      {cert.verified ? (
                        <VerifiedUserIcon fontSize="small" />
                      ) : (
                        <PendingIcon fontSize="small" />
                      )}
                      <Typography variant="caption" color={"GrayText"}>
                        {cert.verified ? "verified" : "Pending"}
                      </Typography>
                    </Stack>
                  }
                >
                  <ListItemIcon>
                    <IconButton onClick={() => deleteCert(cert.id)}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={cert.type_of_lawyer}
                    secondary={
                      <Stack sx={{ width: "100%" }}>
                        <Typography
                          variant="body2"
                          component={"a"}
                          href={cert.certificate}
                          target="_blank"
                          // to={cert.certificate}
                        >
                          {cert.certificate}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={"GrayText"}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          Experience <ArrowRightAltIcon fontSize="small" />
                          {cert.years_of_experience}{" "}
                          {cert.years_of_experience > 1 ? "years" : "year"}
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
            {certs && certs.length === 0 && (
              <Typography
                variant="caption"
                color={"GrayText"}
                textAlign={"center"}
                my={1}
              >
                Add certification which proves your claims
              </Typography>
            )}
            <Button>Add new certificate</Button>
          </Box>
        </Box>
      </Grid>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleClose}
        // sx={{ color: "#00000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <AddCert setCerts={setCerts} setOpen={setOpen} />
      </Dialog>
    </>
  );
}
