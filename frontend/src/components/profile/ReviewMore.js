import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import ClearIcon from "@mui/icons-material/Clear";

export default function ReviewMore() {
  const [token, setToken] = useLocalStorage("token", null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function get_reviews() {
      if (token === null) {
        navigate("/auth/login");
      }
      try {
        const { data } = await API.get("lawyers/me/reviews?total=all", {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        });
        console.log(data);
        setReviews(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    }
    get_reviews();
  }, [navigate, token]);

  const deleteReview = async (id) => {
    try {
      await API.delete(`lawyers/me/reviews?review_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      setReviews((prevState) => prevState.filter((item) => item.id !== id));
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
      <Typography variant="h5">Your Reviews</Typography>
      <Divider sx={{ my: 1 }} />
      {reviews.length === 0 && (
        <Stack height={100} alignItems="center" justifyContent={"center"}>
          <Typography variant="h5">You have no reviews</Typography>
        </Stack>
      )}
      <List>
        {reviews.map((review, index) => (
          <Box>
            <ListItem
              disableGutters
              key={index}
              secondaryAction={
                <Rating value={review.rating} precision={0.5} size="small" />
              }
            >
              <ListItemIcon>
                <IconButton onClick={() => deleteReview(review.id)}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={review.name}
                secondary={
                  <Breadcrumbs separator="-">
                    <Typography
                      variant="body2"
                      //   component={"a"}
                      href={review.email}
                      //   target="_blank"
                      // to={review.reviewificate}
                    >
                      {review.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={"GrayText"}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {new Date(review.created).toDateString()}
                    </Typography>
                  </Breadcrumbs>
                }
              ></ListItemText>
            </ListItem>
            <Typography variant="body2">{review.review}</Typography>
          </Box>
        ))}
      </List>
    </Grid>
  );
}
