import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import lightGreen from "@material-ui/core/colors/lightGreen";

import Map from "./map/Map";
import Notifier from "./snackbar/Notifier";

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: green[700],
      main: green[500],
      light: green[300],
    },
    secondary: {
      main: lightGreen[500],
    },
  },
});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Map />
        <Notifier />
      </ThemeProvider>
    </>
  );
}

export default App;
