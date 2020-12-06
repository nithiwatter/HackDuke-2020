import React from "react";
import {
  GoogleMap,
  InfoBox,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { makeStyles, CircularProgress } from "@material-ui/core";

import ResultBox from "../ResultBox";
import MyMapContext from "./MyMapContext";
import SearchMap from "./search/SearchMap";
import MyInfoBox from "./infobox/MyInfoBox";
import mapStyles from "./mapStyles";
import { openSnackbarExternal } from "../snackbar/Notifier";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  loadingContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    padding: theme.spacing(2),
  },
  mapContainer: {
    width: "70vw",
    height: "100vh",
  },
  resultContainer: {
    width: "30vw",
    height: "100vh",
  },
}));

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapStyles,
};

const zoom = 8;

const center = {
  lat: 36.0014,
  lng: -78.9382,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [myCenter, setMyCenter] = React.useState(center);
  const [markers, setMarkers] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const mapRef = React.useRef();
  const classes = useStyles();

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const panTo = ({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(10);
  };

  const handleSetMarker = (marker) => {
    if (
      markers.find((m) => m.lat === marker.lat && m.lng === marker.lng) !==
      undefined
    )
      return;
    if (markers.length === 2)
      return openSnackbarExternal({
        severity: "error",
        message:
          "You can only select up to two locations - please clear some markers...",
      });
    setMarkers([...markers, marker]);
    panTo(marker);
  };

  const handleSetCurrentLocationMarker = (marker) => {
    if (
      markers.find((m) => m.lat === marker.lat && m.lng === marker.lng) !==
      undefined
    )
      return;
    if (markers.length === 2)
      return openSnackbarExternal({
        severity: "error",
        message:
          "You can only select up to two locations - please clear some markers...",
      });
    handleSetMarker({ lat: marker.lat, lng: marker.lng });
    setMyCenter({ lat: marker.lat, lng: marker.lng });
    panTo(marker);
  };

  const handleDeleteMarker = (marker) => {
    const newMarkers = markers.filter((m) => m !== marker);
    setMarkers(newMarkers);
    setSelectedLocation(null);
  };

  if (loadError) return null;

  if (!isLoaded)
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );

  return (
    <MyMapContext.Provider
      value={{
        markers,
        setMarkers,
        handleSetMarker,
        myCenter,
        handleSetCurrentLocationMarker,
        setSelectedLocation,
        handleDeleteMarker,
      }}
    >
      <div className={classes.root}>
        <div className={classes.mapContainer}>
          <div className={classes.titleContainer}>
            <SearchMap></SearchMap>
          </div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            onLoad={onMapLoad}
            zoom={zoom}
            center={center}
            options={options}
          >
            {markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onMouseOver={() => {
                  if (selectedLocation === marker) return;
                  if (selectedLocation !== null) {
                    setSelectedLocation(null);
                  }
                  setSelectedLocation(marker);
                }}
              />
            ))}
            {selectedLocation ? (
              <InfoBox
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                options={{
                  closeBoxURL: ``,
                  boxStyle: {
                    width: "400px",
                  },
                  enableEventPropagation: true,
                }}
              >
                <MyInfoBox marker={selectedLocation} />
              </InfoBox>
            ) : null}
          </GoogleMap>
        </div>
        <div className={classes.resultContainer}>
          <ResultBox />
        </div>
      </div>
    </MyMapContext.Provider>
  );
}
