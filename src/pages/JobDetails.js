import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  LinearProgress,
  Button,
  withStyles,
  Grid,
  Box,
  Link,
  AppBar, CircularProgress,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
} from "@material-ui/core";
import { useHistory, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import ErrorHandler from "components/ErrorHandler";
import AssetDialog from "components/AssetDialog";
import ActionsHandler from "components/ActionsHandler";
import formatTime from "helpers/formatTime";
import { Job } from "services/api";
import { useParams } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(0),
    position: "relative",
  },
  refreshIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  loading: {
    height: 400, display: 'flex', flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center'
  }, loadingText: {
    marginTop: 20
  }
}));

export default () => {
  const classes = useStyles();
  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [isStaticVisible, setIsStaticVisible] = useState(false);
  const { id } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    setError(false);
    setIsLoading(true);
    Job.get(id, true).then(setJob).catch(setError).finally(() => setIsLoading(false))
  };

  const handleUpdateJob = async () => {
    try {
      setIsLoading(true);
      await Job.update(id, job);
      setIsLoading(false);
      setRedirect("/home/jobs");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  const {
    output,
    state,
    actions, data,
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
    "Started at": ["created", "error"].includes(state)
      ? "---"
      : new Date(dateStarted).toLocaleString(),
    "Finished at":
      state === "finished" ? new Date(dateFinished).toLocaleString() : "---",
  };

  const handleUpdateAsset = (index, value) => new Promise((resolve, reject) => {
    const idArray = Object.keys(data)
    job.data[idArray[index]] = value
    setJob({ ...job, data: job.data })
    resolve(true)
  })
  const handleAssetDelete = (index) => new Promise((resolve, reject) => {
    const idArray = Object.keys(data)
    delete job.data[idArray[index]]
    setJob({ ...job, data: job.data })
    resolve(true)
  })

  if (redirect) return <Redirect to="/home/jobs" />;
  if (isLoading) {
    return <Paper className={classes.loading}>
      <CircularProgress />
      <Typography className={classes.loadingText}>loading please wait...</Typography></Paper>
  }
  return (
    <>
      {error && <ErrorHandler
        message={error?.message ?? "Oop's, Somethings went wrong!"}
        showRetry={true}
        onRetry={() => Object.keys(job).length ? handleUpdateJob() : fetchJob()}
      />}
      <div className={classes.root}>
        <Box p={1} alignItems="right">
          <Button
            disabled={isLoading}
            color="secondary"
            variant="contained"
            onClick={handleUpdateJob}
            children="Update Job"
          />
          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={null}
            children="Restart Job"
          />
        </Box>
        {state === "finished" ? (
          <video
            poster={job.videoTemplate.thumbnail}
            style={{ height: 320, width: "100%" }} controls src={output} />
        ) : (
            <Box
              style={{ background: "gainsboro" }}
              justifyContent="center"
              textAlign="center"
              height={320}>
              <p style={{ padding: 100 }}> No output yet.</p>
            </Box>
          )}
        <Paper>
          <AppBar position="static" color="transparent" elevation={0}>
            <Tabs
              value={activeTabIndex}
              indicatorColor="primary"
              textColor="primary"
              centered
              onChange={(_, i) => setActiveTabIndex(i)}
              aria-label="simple tabs example">
              <Tab label="Output" {...a11yProps(0)} />
              <Tab label="Assets" {...a11yProps(1)} />
              <Tab label="Actions" {...a11yProps(2)} />
            </Tabs>
          </AppBar>

          <TabPanel value={activeTabIndex} index={0}>
            <Grid xs={12} item>
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
          </TabPanel>
          <TabPanel value={activeTabIndex} index={1}>
            <MaterialTable
              style={{ boxShadow: "none" }}
              options={{
                pageSize: 5,
                headerStyle: { fontWeight: 700 },
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowUpdate: async (newData, oldData) => {
                  return await handleUpdateAsset(oldData.tableData.id, newData.value)
                }
                ,
                onRowDelete: async oldData => {
                  return await handleAssetDelete(oldData.tableData.id)
                }

              }}
              columns={[
                {
                  title: "Field Id",
                  field: "key"
                  , editable: 'never'
                },
                {
                  title: "Value",
                  field: "value"
                },
              ]}

              data={Object.keys(data).map(key => ({ key: key, value: data[key] }))}
              title="Assets"
            />
          </TabPanel>
          <TabPanel value={activeTabIndex} index={2}>
            <ActionsHandler
              onSubmit={(actions) => setJob({ ...job, actions })}
              // set the key
              prerender={
                actions?.prerender?.map((action) => ({
                  installFonts: action,
                })) ?? []
              }
              // set the key to every acrtion
              postrender={
                actions?.postrender?.map((action) => {
                  switch (action.module) {
                    case "@nexrender/action-encode":
                      return { compress: action };
                    case "action-watermark":
                      return { addWaterMark: action };
                    case "@nexrender/action-upload":
                      return { upload: action };
                    default:
                      return;
                  }
                }) ?? []
              }
            />
          </TabPanel>
        </Paper>
      </div>
      {/* {isDialogOpen && (
        <AssetDialog
          setIsDialogOpen={setIsDialogOpen}
          fields={videoTemplate?.fields}
          initialValues={editIndex !== null && data[editIndex]}
          onSubmit={handleAssetSubmit}
        />
      )} */}
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
