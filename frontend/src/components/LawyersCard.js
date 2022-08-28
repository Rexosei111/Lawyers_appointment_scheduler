import {
  Avatar,
  Breadcrumbs,
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
    <Card elevation={0}>
      <CardActionArea onClick={() => handleClick(lawyer.id)}>
        <CardHeader
          // action={<Rating value={4} readOnly size="medium" />}
          avatar={
            <Avatar
              sx={{ height: 70, width: 70 }}
              aria-label="recipe"
              src={lawyer.picture}
            >
              {lawyer.first_name.charAt(0)}
            </Avatar>
          }
          title={`${lawyer.first_name} ${lawyer.other_names} ${lawyer.last_name}`}
          subheader={
            <Breadcrumbs separator="-">
              {lawyer.category_set.map((item, index) => (
                <Typography variant="caption" key={index}>
                  {item.type_of_lawyer}
                </Typography>
              ))}
            </Breadcrumbs>
          }
          titleTypographyProps={{
            variant: "body1",
            fontSize: 25,
          }}
        />
        <CardContent>
          <Typography variant="body2">
            {truncateText(lawyer.biography)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
