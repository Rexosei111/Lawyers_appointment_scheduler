import { Button, Card, CardMedia } from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AfterUpload({ link, setLink, setFile, setstatus }) {
  const handleClick = () => {
    setLink(null);
    setFile(null);
    setstatus(null);
  };
  return (
    <>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia
          component={"img"}
          alt="uploaded image"
          height={"219"}
          image={link}
        />
      </Card>
      <Button
        onClick={handleClick}
        startIcon={<DeleteForeverIcon />}
        sx={{ ml: "auto", color: "red" }}
      >
        Delete
      </Button>
    </>
  );
}
