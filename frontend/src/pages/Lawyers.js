import { Paper, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import LawyersCard from "../components/LawyersCard";
import { useLocalStorage } from "../hooks/storage";
import { API } from "../lib/Axios_init";

export default function Lawyers() {
  const [lawyers, setLawyers] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function getLawyers() {
      setFetching(true);
      const { data } = await API.get("lawyers", {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      console.log(data);
      setLawyers(data);
      setFetching(false);
    }
    getLawyers();
  }, [token]);

  return (
    <>
      <Container maxWidth="md">
        {fetching ? (
          <Typography>Fetching...</Typography>
        ) : lawyers === null || lawyers.length === 0 ? (
          <Typography>Nothing to show</Typography>
        ) : (
          <Stack justifyContent={"center"} spacing={2}>
            {lawyers.map((lawyer) => (
              <LawyersCard lawyer={lawyer} key={lawyer.id} />
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
}
