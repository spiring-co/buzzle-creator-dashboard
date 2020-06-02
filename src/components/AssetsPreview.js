import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, TextField, Paper, Button } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({

  button: {
    marginTop: 10

  },

  asset: {
    width: 'fit-content',
    marginTop: 10,
    margin: 5,
    padding: 20
  },
  greyText: {
    color: 'lightgrey'
  }
}));

function RenderAsset({ type, layerName, property, value, src, onChange, onEdit }) {
  const classes = useStyles();
  switch (type) {
    case "data":
      return (
        <Paper className={classes.asset}>
          <Typography><strong>Layer Name: </strong>{layerName}</Typography>
          <Typography><strong>Value: </strong>{value}</Typography>
          <Button
            className={classes.button}
            size="small"
            color="primary"
            variant="outlined"
            children="Edit" onClick={onEdit} />
        </Paper>
      );
    case "image":
      return (
        <Paper className={classes.asset}>
          <Typography><strong>Layer Name: </strong>{layerName}</Typography>

          <Typography><strong>Value: </strong></Typography>
          <img src={src} width="100" height="100" style={{ marginTop: 10, }} />

          <br />
          <Button
            className={classes.button}
            size="small"
            color="primary"
            variant="outlined"
            children="Edit" onClick={onEdit} />
        </Paper>
      );
    case "audio":
      return (
        <Paper>
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
        </Paper>
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

    <RenderAsset {...props} />

  );
};
