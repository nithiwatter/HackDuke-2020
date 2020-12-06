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
import ClassIcon from "@material-ui/icons/Class";
import FileIcon from "@material-ui/icons/FileCopy";
import UploadIcon from "@material-ui/icons/Publish";
import distinctColors from "distinct-colors";

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2), width: "100%" },
  fileContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    margin: theme.spacing(2),
  },
  sliderContainer: {
    margin: theme.spacing(2),
  },
}));

export default function ResultBox({ setChildrenMarkers, setColors }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [classroomValue, setClassroomValue] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [filename, setFilename] = React.useState(null);

  const onUpload = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    fetch("/api/testupload", {
      method: "POST",
      body: data,
    });
    setFilename(null);
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSliderChangeC = (event, newValue) => {
    setClassroomValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleInputChangeC = (event) => {
    setClassroomValue(
      event.target.value === "" ? "" : Number(event.target.value)
    );
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };
  const handleBlurC = () => {
    if (value < 0) {
      setClassroomValue(0);
    } else if (value > 100) {
      setClassroomValue(100);
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

      <div className={classes.fileContainer}>
        <input
          accept=".csv"
          onChange={onUpload}
          hidden
          id="contained-button-file"
          type="file"
        />

        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            className={classes.uploadBtns}
            endIcon={filename ? null : <FileIcon />}
          >
            {filename ? filename : "File"}
          </Button>
        </label>

        <Button
          variant="contained"
          color="secondary"
          onClick={onSubmit}
          className={classes.uploadBtns}
          endIcon={<UploadIcon />}
        >
          Upload
        </Button>
      </div>

      <div className={classes.sliderContainer}>
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
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <ClassIcon />
          </Grid>
          <Grid item xs>
            <Slider
              value={typeof classroomValue === "number" ? classroomValue : 0}
              onChange={handleSliderChangeC}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={classroomValue}
              margin="dense"
              onChange={handleInputChangeC}
              onBlur={handleBlurC}
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
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={getAPIData}>
          Click
        </Button>
      </div>
    </div>
  );
}
