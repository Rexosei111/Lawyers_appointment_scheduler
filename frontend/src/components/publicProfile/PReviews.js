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
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../../hooks/storage";
import { API } from "../../lib/Axios_init";
import ClearIcon from "@mui/icons-material/Clear";

export default function PReviews() {
  const [token, setToken] = useLocalStorage("token", null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function get_reviews() {
      try {
        const { data } = await API.get(
          `lawyers/profile/${params.id}/reviews`,
          {}
        );
        setReviews(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response.status === 401) {
          navigate("/auth/login");
        }
      }
    }
    get_reviews();
  }, [navigate, params.id]);

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
      <Typography variant="h5">Reviews</Typography>
      <Divider sx={{ my: 1 }} />
      {reviews.length === 0 && (
        <Stack height={100}>
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
      {/* <Button
          sx={{ ml: "auto" }}
          size="small"
          variant="outlined"
          color="info"
          onClick={() => navigate("/lawyers/me/reviews")}
        >
          View more
        </Button> */}
    </Grid>
  );
}
