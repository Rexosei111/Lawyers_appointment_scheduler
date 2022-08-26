import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Rating,
  Typography,
} from "@mui/material";
import { blueGrey, red } from "@mui/material/colors";
import React from "react";
import { useNavigate } from "react-router-dom";

import { truncateText } from "../utils";

export default function LawyersCard({ lawyer }) {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`profile/${id}`);
  };
  return (
    <Card elevation={0} variant="outlined">
      <CardActionArea onClick={() => handleClick(lawyer.id)}>
        <CardHeader
          action={<Rating value={4} readOnly size="medium" />}
          avatar={
            <Avatar
              sx={{ bgcolor: blueGrey[500], height: 70, width: 70 }}
              aria-label="recipe"
              src={lawyer.picture}
            >
              {lawyer.first_name.charAt(0)}
            </Avatar>
          }
          title={`${lawyer.first_name} ${lawyer.other_names} ${lawyer.last_name}`}
          subheader="Criminal Defence"
          titleTypographyProps={{
            variant: "h6",
          }}
        />
        <CardContent>
          <Typography>{truncateText(lawyer.biography)}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
