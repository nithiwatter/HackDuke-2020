import React from "react";
import {
  Paper,
  InputBase,
  Divider,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import DirectionsIcon from "@material-ui/icons/Directions";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";

import MyMapContext from "../MyMapContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 700,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchMapInputBase({
  InputProps,
  inputProps,
  handleDeleteInput,
}) {
  const functionUtils = React.useContext(MyMapContext);
  const classes = useStyles();

  const setCurrentLocation = (e) => {
    e.stopPropagation();
    navigator.geolocation.getCurrentPosition((position) => {
      functionUtils.handleSetCurrentLocationMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <Paper component="form" className={classes.root}>
      <Tooltip title="Menu">
        <IconButton className={classes.iconButton}>
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <InputBase
        className={classes.input}
        placeholder="Search Google Maps"
        ref={InputProps.ref}
        inputProps={inputProps}
      />
      <IconButton className={classes.iconButton} onClick={handleDeleteInput}>
        <CloseIcon />
      </IconButton>

      <Divider className={classes.divider} orientation="vertical" />

      <Tooltip title="Show directions between selected locations">
        <IconButton color="primary" className={classes.iconButton}>
          <DirectionsIcon />
        </IconButton>
      </Tooltip>

      <Divider className={classes.divider} orientation="vertical" />

      <Tooltip title="Current location">
        <IconButton
          color="primary"
          className={classes.iconButton}
          onClick={setCurrentLocation}
        >
          <LocationOnIcon />
        </IconButton>
      </Tooltip>

      <Divider className={classes.divider} orientation="vertical" />

      <Tooltip title="Clear all markers">
        <IconButton
          color="primary"
          className={classes.iconButton}
          onClick={() => {
            functionUtils.setMarkers([]);
            functionUtils.setSelectedLocation(null);
          }}
        >
          <DeleteSweepIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
