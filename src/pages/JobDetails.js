import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  LinearProgress,
  Button,
  withStyles,
} from "@material-ui/core";
import AssetsPreview from "components/AssetsPreview";
import { makeStyles } from "@material-ui/core/styles";
import { updateJob } from "services/api";
import { useParams } from "react-router-dom";
import ErrorHandler from "components/ErrorHandler";
import AddAssetDialog from 'components/AddAssetDialog'

import { Add } from '@material-ui/icons'
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [initialValue, setInitialValue] = useState({})
  const [editIndex, setEditIndex] = useState(null)
  useEffect(() => {
    fetchJobDetails();
  }, []);



  const handleAddAsset = (data) => {

    jobDetails.assets.push(data)
    setJobDetails(jobDetails)

  }
  const editAssetValue = (data) => {

    jobDetails.assets[editIndex] = data
    setJobDetails(jobDetails)
  }

  const fetchJobDetails = async () => {
    try {
      setError(false)
      setLoading(true)
      const result = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${jobId}?populateVideoTemplate=true`)
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

  const handleUpdateJob = async () => {
    try {

      setLoading(true)
      await updateJob(jobId, jobDetails)
      setLoading(false)

    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  if (error)
    return (
      <ErrorHandler
        message={error?.message ?? "Oop's, Somethings went wrong!"}
        showRetry={true}
        onRetry={() => fetchJobDetails()}
      />
    );

  var { output, state, assets, videoTemplate, idVersion } = jobDetails;
  videoTemplate = videoTemplate?.versions[videoTemplate?.versions.map(({ id }) => id).indexOf(idVersion)]

  return (

    <>
      {loading ? <CustomProgress /> : ""}
      <Paper className={classes.container}>
        {isDialogOpen && <AddAssetDialog
          usedLayers={assets.map(({ layerName }) => layerName)}
          editableLayers={videoTemplate?.editableLayers}
          initialValue={editIndex !== null && { ...jobDetails.assets[editIndex] }}
          editAsset={editIndex !== null}
          toggleDialog={setIsDialogOpen}
          editAssetValue={editAssetValue}
          addAsset={handleAddAsset}

        />}
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
        <br />
        <Button
          style={{ marginTop: 10 }}
          startIcon={<Add />} color="primary" variant="outlined"
          onClick={() => {
            setEditIndex(null)
            setIsDialogOpen(true)
          }}
          children="Add Asset" />
        <Typography variant="h5" style={{ marginTop: 10, fontWeight: 'bold' }}>Assets</Typography>

        {assets?.map((props, index) => {
          return <AssetsPreview {...props}
            onEdit={() => {
              setEditIndex(index)
              setIsDialogOpen(true)
            }}
          />;
        })}
        <Button
          disabled={loading} color="primary" variant="contained" onClick={handleUpdateJob}
          children="Update Job" />
      </Paper>

    </>
  );
};

const getColorFromState = (state) => {

  switch (state) {
    case "finished":
      return "#4caf50";
    case "error":
      return "#f44336";
    default:
      return "grey";
  }
};
