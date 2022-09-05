import {
  Box,
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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import AddIcon from "@mui/icons-material/Add";
import UploadForm from "./UploadFile";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function File() {
  const [token, setToken] = useLocalStorage("token", null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function get_reviews() {
      if (token === null) {
        navigate("/auth/login");
      }
      try {
        const { data } = await API.get("lawyers/me/files", {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        console.log(data);
        setFiles(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    }
    get_reviews();
  }, [navigate, token]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const deleteFile = async (id) => {
    try {
      await API.delete(`lawyers/me/files?file_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      setFiles((prevState) => prevState.filter((item) => item.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.status === 401) {
        navigate("/auth/login");
      }
    }
  };
  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={0}
      variant="outlined"
      padding={2}
      my={2}
    >
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="h5">Your Files</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleToggle}
        >
          Add File
        </Button>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {files.length === 0 && (
        <Stack height={100} alignItems="center" justifyContent={"center"}>
          <Typography variant="h5">You have no Files</Typography>
        </Stack>
      )}
      <List>
        {files.map((file, index) => (
          <Box>
            <ListItem
              disableGutters
              key={index}
              secondaryAction={
                <IconButton component="a" href={file.url}>
                  <DownloadForOfflineIcon fontSize="medium" />
                </IconButton>
              }
            >
              <ListItemIcon>
                <IconButton onClick={() => deleteFile(file.id)}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={file.title}
                secondary={file.url}
              ></ListItemText>
            </ListItem>
            <Typography variant="body2">{file.description}</Typography>
          </Box>
        ))}
      </List>
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        // sx={{ color: "#00000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <UploadForm handleClose={handleClose} setUploadFiles={setFiles} />
      </Dialog>
    </Grid>
  );
}
