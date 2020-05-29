import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  container: {
    padding: 20,
  },
  assetsContainer: {
    display: "flex",

    marginTop: 10,
  },
  layerName: { fontWeight: "bold" },
  asset: {
    textAlign: "center",
    margin: 5,
  },
}));

function RenderAsset({ type, layerName, property, value, src }) {
  const classes = useStyles();
  switch (type) {
    case "data":
      return (
        <>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Layer Name</Typography>
            <p>{layerName}</p>
          </div>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Property</Typography>
            <p>{property}</p>
          </div>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Value</Typography>
            <p>{value}</p>
          </div>
        </>
      );
    case "image":
      return (
        <>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Layer Name</Typography>
            <p>{layerName}</p>
          </div>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Value</Typography>
            <img alt="value" style={{ height: 100, width: 100 }} src={src} />
          </div>
        </>
      );
    case "audio":
      return (
        <>
          <div className={classes.asset}>
            <Typography className={classes.layerName}>Layer Name</Typography>
            <p>{layerName}</p>
          </div>

          <div className={classes.asset}>
            <Typography className={classes.layerName}>Value</Typography>

            <audio controls>
              <source src={src} />
            </audio>
          </div>
        </>
      );
    default:
      return <div />;
  }
}

RenderAsset.propTypes = {
  type: PropTypes.any,
};
export default (props) => {
  const classes = useStyles();
  return (
    <div className={classes.assetsContainer}>
      <RenderAsset {...props} />
    </div>
  );
};
