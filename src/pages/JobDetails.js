import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  LinearProgress,
  Button,
  withStyles,
  IconButton,
  Grid,
  Divider,
  Box,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import AssetsPreview from "components/AssetsPreview";
import ErrorHandler from "components/ErrorHandler";
import AddAssetDialog from "components/AddAssetDialog";

import formatTime from "helpers/formatTime";
import { Job } from "services/api";
import { useParams } from "react-router-dom";

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
    padding: theme.spacing(0),
    position: "relative",
  },
  refreshIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
}));

export default (props) => {
  const classes = useStyles();

  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const handleAddAsset = (data) => {
    job.assets.push(data);
    setJob(job);
  };
  const editAssetValue = (data) => {
    job.assets[editIndex] = data;
    setJob(job);
  };

  const fetchJob = async () => {
    setError(false);
    setIsLoading(true);

    try {
      Job.get(id, true).then(setJob);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    try {
      setIsLoading(true);
      await Job.update(id, job);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  if (error)
    return (
      <ErrorHandler
        message={error?.message ?? "Oop's, Somethings went wrong!"}
        showRetry={true}
        onRetry={() => fetchJob()}
      />
    );

  const {
    output,
    state,
    assets,
    videoTemplate: vt,
    idVersion,
    renderTime,
    queueTime,
    dateCreated,
    dateFinished,
    dateStarted,
  } = job;
  const videoTemplate =
    vt?.versions[vt?.versions.map(({ id }) => id).indexOf(idVersion)];

  const content = {
    "Job ID": id,
    "Render Time": formatTime(renderTime),
    "Queue Time": formatTime(queueTime),
    "Created at": new Date(dateCreated).toLocaleString(),
    "Started at": new Date(dateStarted).toLocaleString(),
    "Finished at": new Date(dateFinished).toLocaleString(),
  };

  return (
    <>
      {isLoading ? <CustomProgress /> : ""}
      <Typography variant="h4">Job Details</Typography>
      <Paper className={classes.container}>
        <Grid container spacing={0}>
          <Grid xs={6} item>
            {state === "finished" ? (
              <video style={{ height: 320 }} controls src={output} />
            ) : (
              <Box backgroundColor="grey" textAlign="center" height={320}>
                No output yet.
              </Box>
            )}
            <Box p={2}>
              <Typography variant="h5">Details</Typography>
              <br />
              {Object.keys(content).map((k) => (
                <Grid key={k} container direction={"row"} spacing={1}>
                  <Grid xs={6} item>
                    <Typography> {k}</Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography> {content[k]}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Grid>
          <Grid xs={6} item>
            <Divider orientation="vertical" flexItem />
            <Box p={2}>
              <Typography variant="h5">Assets</Typography>

              {assets?.map((props, index) => {
                return (
                  <AssetsPreview
                    key={index}
                    {...props}
                    onEdit={() => {
                      setEditIndex(index);
                      setIsDialogOpen(true);
                    }}
                  />
                );
              })}
              <Button
                style={{ marginTop: 10 }}
                startIcon={<Add />}
                color="primary"
                variant="outlined"
                onClick={() => {
                  setEditIndex(null);
                  setIsDialogOpen(true);
                }}
                children="Add Asset"
              />
              <Button
                disabled={isLoading}
                color="primary"
                variant="contained"
                onClick={handleUpdateJob}
                children="Update Job"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {isDialogOpen && (
        <AddAssetDialog
          usedLayers={assets.map(({ layerName }) => layerName)}
          editableLayers={videoTemplate?.editableLayers}
          initialValue={editIndex !== null && { ...job.assets[editIndex] }}
          editAsset={editIndex !== null}
          toggleDialog={setIsDialogOpen}
          editAssetValue={editAssetValue}
          addAsset={handleAddAsset}
        />
      )}
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
