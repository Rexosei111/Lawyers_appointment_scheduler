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
import React, { useEffect, useState } from "react";
import certificateBg2 from "../../assets/certificateBg2.svg";

import { API } from "../../lib/Axios_init";
import { useLocalStorage } from "../../hooks/storage";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function Certificates({ email }) {
  const [certs, setCerts] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);

  useEffect(() => {
    async function getCerts() {
      const { data } = await API.get(`lawyers/profile/${email}/certs`, {});
      console.log(data);
      setCerts(data);
    }
    getCerts();
  }, [email, token]);

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
        </Stack>
        <Typography variant="caption" color={"GrayText"}>
          Accreditations for operation
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            width: "100%",
            [certs && certs.length === 0]: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
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
        </Box>
      </Grid>
    </>
  );
}
