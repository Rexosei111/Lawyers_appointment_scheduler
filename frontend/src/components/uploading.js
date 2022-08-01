import React, { useState } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { axiosConfig, uploadAPI } from "../lib/Axios_init";

function Uploading({ File, setstatus, setLink }) {
  const matches = useMediaQuery("(min-width:500px)");

  const [Progress, setProgress] = useState(0);

  React.useEffect(() => {
    const config = axiosConfig(setProgress);
    let Data = new FormData();
    Data.append("file", File);

    uploadAPI.post("upload", Data, config).then((res) => {
      setLink(res.data.link);
      setstatus("done");
    });
  }, [File, setLink, setstatus]);

  return (
    <Paper
      sx={{
        width: matches ? 402 : "100%",
        height: 80,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-start",
      }}
      elevation={2}
    >
      <Typography variant="h6" component="h1">
        Uploading...
      </Typography>
      <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={Progress} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {`${Math.round(Progress)}%`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default Uploading;
