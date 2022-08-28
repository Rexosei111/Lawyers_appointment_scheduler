import { Container, MenuItem, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SearchField from "./searchField";
import ResponsiveAppBar from "./TopNav";

const filterOptions = [
  { label: "Bankruptcy", value: "Bankruptcy" },
  { label: "Business", value: "Business" },
  { label: "Constitutional", value: "Constitutional" },
  { label: "Criminal Defense", value: "Criminal Defense" },
  { label: "Employment and Labor", value: "Employment and Labor" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Estate Planning", value: "Estate Planning" },
  { label: "Family", value: "Family" },
  { label: "Immigration", value: "Immigration" },
  { label: "Intellectual Property", value: "Intellectual Property" },
  { label: "Personal Injury", value: "Personal Injury" },
  { label: "Tax", value: "Tax" },
];

export default function LawyersLayout() {
  const [filter, setFilter] = useState("Bankruptcy");

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Stack
          my={2}
          columnGap={2}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <SearchField filter={filter} />
          <TextField
            id="outlined-select-filter"
            select
            label="Filter by"
            value={filter}
            onChange={handleChange}
            // helperText="Please select your currency"
          >
            {filterOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Outlet />
      </Container>
    </>
  );
}
