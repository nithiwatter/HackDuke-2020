import React from "react";
import axios from "axios";
import { Button, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2), width: "100%" },
}));

export default function ResultBox() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center">
        Friendship Tracker
      </Typography>
      <Button variant="contained">Click</Button>
    </div>
  );
}
