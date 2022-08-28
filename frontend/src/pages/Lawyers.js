import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import LawyersCard from "../components/LawyersCard";
import { useLocalStorage } from "../hooks/storage";
import { API } from "../lib/Axios_init";

export default function Lawyers() {
  const location = useLocation();

  const [lawyers, setLawyers] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [fetching, setFetching] = useState(false);
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  useEffect(() => {
    console.log(query);
    async function getLawyers() {
      setFetching(true);
      const { data } = await API.get(`lawyers?${query}`);
      console.log(data);
      setLawyers(data);
      setFetching(false);
    }
    getLawyers();
  }, [token, query]);

  return (
    <>
      <Container>
        {fetching ? (
          <Typography>Fetching...</Typography>
        ) : lawyers === null || lawyers.length === 0 ? (
          <Typography>Nothing to show</Typography>
        ) : (
          <Grid container justifyContent={"flex-start"} spacing={2}>
            {lawyers.map((lawyer) => (
              <Grid item xs={12} md={6}>
                <LawyersCard lawyer={lawyer} key={lawyer.id} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
