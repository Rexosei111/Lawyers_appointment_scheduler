import { Box, Typography } from "@mui/material";
import React from "react";
import backgroundSVG from "../assets/image.svg";

const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/x-icon",
];

function DropArea({
  setFile,
  setOpen,
  open,
  setmessage,
  message,
  setSeverity,
}) {
  const dragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const drop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (fileTypes.includes(file.type)) {
      setFile(file);
      setSeverity("success");
    } else {
      setSeverity("error");
      setmessage("Unsupported file format!");
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 3,
        border: open ? "1px dashed red" : "1px dashed #97BEF4",
        backgroundColor: "#F6F8FB",
        height: 219,
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "inherit",
          width: "inherit",
          backgroundColor: "transparent",
          backgroundImage: `url(${backgroundSVG})`,
          backgroundPosition: "50% 30%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onDragEnter={dragEnter}
        onDragOver={dragOver}
        onDrop={drop}
      >
        <Typography variant={"h6"} color={open ? "red" : "GrayText"} mt={10}>
          {open ? message : "Drag & Drop your image here"}
        </Typography>
      </Box>
    </Box>
  );
}

export default DropArea;
