import React from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Slider,
  Grid,
  Input,
  makeStyles,
} from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import distinctColors from "distinct-colors";

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2), width: "100%" },
}));

export default function ResultBox({ setChildrenMarkers, setColors }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const getAPIData = async () => {
    const childrenMarkers = [];
    var totalClusters = 0;
    const { data } = await axios.post("/api/test2", {
      friendshipValue: value / 100,
    });

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
    setColors(distinctColors({ count: totalClusters, quality: totalClusters }));
    setChildrenMarkers(childrenMarkers);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" align="center">
        Friendship Tracker
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <PeopleIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={getAPIData}>
          Click
        </Button>
      </div>
    </div>
  );
}
