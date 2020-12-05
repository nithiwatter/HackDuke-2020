import React from "react";
import { getDetails } from "use-places-autocomplete";
import {
  Paper,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteIcon from "@material-ui/icons/Delete";

import MyMapContext from "../MyMapContext";

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    padding: theme.spacing(5),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  cardContainer: {
    // minWidth: 350,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 30,
  },
  rating: {
    marginTop: theme.spacing(2),
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    objectFit: "cover",
    height: "100px",
  },
}));

export default function MyInfoBox({ marker }) {
  const [loading, setLoading] = React.useState(true);
  const [details, setDetails] = React.useState(null);
  const functionUtils = React.useContext(MyMapContext);
  const classes = useStyles();

  React.useEffect(() => {
    if (marker.placeId) {
      const fetchDetails = async () => {
        const response = await getDetails({ placeId: marker.placeId });
        setTimeout(() => {
          setDetails(response);
          setLoading(false);
        }, 300);
      };
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [marker.placeId]);

  if (loading) {
    return (
      <Paper className={classes.loadingContainer}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!details) {
    return (
      <Paper className={classes.textContainer}>
        <Typography variant="body2">
          Sorry, no information is available for this location...
        </Typography>
        <div className={classes.iconContainer}>
          <IconButton>
            <LocationOnIcon />
          </IconButton>
          <IconButton>
            <CloseIcon />
          </IconButton>
          <IconButton style={{ marginLeft: "auto" }}>
            <DeleteIcon />
          </IconButton>
        </div>
      </Paper>
    );
  }

  return (
    <Card>
      <div onMouseLeave={() => functionUtils.setSelectedLocation(null)}>
        {details.photos.length !== 0 ? (
          <CardMedia
            component="img"
            src={details.photos[0].getUrl()}
            className={classes.media}
            title="Contemplative Reptile"
          />
        ) : null}

        <CardContent>
          <div className={classes.titleContainer}>
            <Typography variant="h6">{details.name}</Typography>
            <img src={details.icon} className={classes.icon} alt=""></img>
          </div>

          <Typography variant="body2" color="textSecondary" component="p">
            {details.formatted_address}
          </Typography>
          <Rating
            name="read-only"
            readOnly
            value={details.rating ? details.rating : 0}
            className={classes.rating}
          />
        </CardContent>
        <Divider></Divider>
        <CardActions disableSpacing>
          <IconButton onClick={() => functionUtils.setSelectedLocation(null)}>
            <CloseIcon />
          </IconButton>
          <IconButton
            style={{ marginLeft: "auto" }}
            onClick={() => functionUtils.handleDeleteMarker(marker)}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </div>
    </Card>
  );
}
