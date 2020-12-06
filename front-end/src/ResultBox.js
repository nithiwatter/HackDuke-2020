import React from "react";
import axios from "axios";
import { Button, Typography, makeStyles } from "@material-ui/core";
import distinctColors from "distinct-colors";

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2), width: "100%" },
}));

export default function ResultBox({ setChildrenMarkers, setColors }) {
  const classes = useStyles();

  const getAPIData = async () => {
    const childrenMarkers = [];
    var totalClusters = 0;
    const { data } = await axios.get("/api/test2");

    for (const clusterNumber in data) {
      totalClusters += 1;
      for (const student of data[clusterNumber]) {
        childrenMarkers.push({
          lat: student[0],
          lng: student[1],
          clusterNumber: parseInt(clusterNumber),
        });
      }
    }
    console.log(data);
    setColors(distinctColors({ count: totalClusters }));
    setChildrenMarkers(childrenMarkers);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center">
        Friendship Tracker
      </Typography>
      <Button variant="contained" onClick={getAPIData}>
        Click
      </Button>
    </div>
  );
}
