import { alpha, createTheme, responsiveFontSizes } from "@mui/material";
import { blue, blueGrey, orange, cyan } from "@mui/material/colors";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      // primary: {
      //   main: "#28c7f",
      // },
      background: {
        paper: "#fdfdfd",
        default: cyan,
      },
    },
  })
);
