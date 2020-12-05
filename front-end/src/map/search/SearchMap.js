import React from "react";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { makeStyles, Typography, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getGeocode } from "use-places-autocomplete";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

import MyMapContext from "../MyMapContext";
import SearchMapInputBase from "./SearchMapInputBase";

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function GoogleMaps() {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const functionUtils = React.useContext(MyMapContext);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
        location: {
          lat: () => functionUtils.myCenter.lat,
          lng: () => functionUtils.myCenter.lng,
        },
        radius: 100 * 1000,
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [
    value,
    inputValue,
    fetch,
    functionUtils.myCenter.lat,
    functionUtils.myCenter.lng,
  ]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      inputValue={inputValue}
      onChange={async (_, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          let geolocation = await getGeocode({ address: newValue.description });
          geolocation = geolocation[0];
          const lat = geolocation.geometry.location.lat();
          const lng = geolocation.geometry.location.lng();
          functionUtils.handleSetMarker({
            lat,
            lng,
            placeId: newValue.place_id,
            description: newValue.description,
          });
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <SearchMapInputBase
          {...params}
          handleDeleteInput={() => {
            setValue(null);
            setInputValue("");
          }}
        />
      )}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
