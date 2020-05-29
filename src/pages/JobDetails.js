import React from "react";
import { Typography, Paper } from "@material-ui/core";
import AssetsPreview from "components/AssetsPreview";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));

export default (props) => {
  const classes = useStyles();

  //TODO fetch from /job/:jobID
  const { jobDetails } = props?.location?.state;
  const { output, state, assets } = jobDetails;

  return (
    <Paper className={classes.container}>
      <Typography variant="h4">Job Details</Typography>
      <Typography variant="h5">Status</Typography>
      {/* TODO display as chip */}
      <Typography
        style={{
          color: state === "finished" ? "green" : "orange",
        }}
      >
        {state}
      </Typography>

      <Typography variant="h5">Output</Typography>
      {state === "finished" ? (
        <video
          style={{
            width: 320,
            height: 220,
            marginTop: 10,
          }}
          controls
          src={output}
        />
      ) : (
        <Typography style={{ color: "grey" }}>No Output Yet</Typography>
      )}

      <Typography variant="h5">Assets</Typography>

      {assets.map((props) => {
        return <AssetsPreview {...props} />;
      })}
    </Paper>
  );
};
