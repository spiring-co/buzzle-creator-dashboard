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
<<<<<<< HEAD
  const classes = useStyles();
=======
    var { jobDetails } = props?.location?.state
    console.log(jobDetails.assets)
    var { output, state, assets } = jobDetails
    const classes = useStyles()
    return (
        <Paper className={classes.container}>
            <Typography variant="h4">Job Details</Typography>
            <Typography style={{ marginTop: 10, }} variant="h5">Status</Typography>
            <Typography
                style={{
                    color: state === 'finished' ? 'green'
                        : 'orange'
                }}>{state}</Typography>
            <Typography
                style={{ marginTop: 10, }} variant="h5">Output</Typography>
            {state === 'finished' ?
                <video
                    style={{
                        width: 320,
                        height: 220,
                        marginTop: 10
                    }} controls
                    src={output}
                /> : <Typography style={{ color: 'grey' }}>No Output Yet</Typography>}
>>>>>>> 2aa364d62e73232310cf10c5ae323532b5141a63

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
