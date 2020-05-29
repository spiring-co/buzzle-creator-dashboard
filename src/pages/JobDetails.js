import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import AssetsPreview from "components/AssetsPreview";
import { makeStyles } from "@material-ui/core/styles";
import useApi from "services/api";
import { useParams } from "react-router-dom";
import ErrorHandler from "components/ErrorHandler";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));

export default (props) => {
  const classes = useStyles();
  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { jobId } = useParams();

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      setError(false)
      setLoading(true)
      const result = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${jobId}`)
      setLoading(true);

      if (result.ok) {
        setJobDetails(await result.json());
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(err);
    }
  };

  if (error)
    return (
      <ErrorHandler
        message={error?.message ?? "Oop's, Somethings went wrong!"}
        showRetry={true}
        onRetry={() => fetchJobDetails()}
      />
    );

  var { output, state, assets } = jobDetails;
  return (

    <>
      {loading ? <CustomProgress /> : ""}
      <Paper className={classes.container}>

        <Typography variant="h4">Job Details</Typography>
        <Typography variant="h5" style={{ marginTop: 10, fontWeight: 'bold' }}>Status</Typography>
        <Typography
          style={{
            color: getColorFromState(state),
          }}
        >
          {state}
        </Typography>

        <Typography variant="h5" style={{ marginTop: 10, fontWeight: 'bold' }}>Output</Typography>
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

        <Typography variant="h5" style={{ marginTop: 10, fontWeight: 'bold' }}>Assets</Typography>

        {assets?.map((props) => {
          return <AssetsPreview {...props} />;
        })}
      </Paper>
    </>
  );
};

const getColorFromState = (state) => {
  console.log(state);
  switch (state) {
    case "finished":
      return "#4caf50";
    case "error":
      return "#f44336";
    default:
      return "grey";
  }
};
