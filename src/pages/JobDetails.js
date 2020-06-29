import React, { useEffect, useState } from "react";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import UpdateIcon from "@material-ui/icons/Update";
import PublishIcon from "@material-ui/icons/Publish";
import {
  Typography,
  Paper,
  Button,
  Grid,
  Box,
  AppBar,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import ErrorHandler from "components/ErrorHandler";
import ActionsHandler from "components/ActionsHandler";
import formatTime from "helpers/formatTime";
import { Job } from "services/api";
import { useParams, useHistory } from "react-router-dom";
import MaterialTable from "material-table";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginRight: 20,
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
    height: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
  },
}));

export default () => {
  const classes = useStyles();
  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    setError(false);
    setIsLoading(true);
    Job.get(id, true)
      .then(setJob)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  const handleUpdateJob = async () => {
    try {
      const { data, actions, id } = job;
      setIsLoading(true);
      await Job.update(id, { data, actions });
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
    actions,
    data,
    renderTime,
    queueTime,
    dateCreated,
    dateFinished,
    dateStarted,
  } = job;

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

  const handleUpdateAsset = async (index, key, value) => {
    console.log(key, value);
    const idArray = Object.keys(data);
    job.data[idArray[index]] = value;
    console.log(job);
    setJob({ ...job, data: job.data });
  };

  const handleAssetDelete = async (index) => {
    const idArray = Object.keys(data);
    delete job.data[idArray[index]];
    setJob({ ...job, data: job.data });
  };

  if (redirect) return <Redirect to="/home/jobs" />;
  if (isLoading) {
    return (
      <Paper className={classes.loading}>
        <CircularProgress />
        <Typography className={classes.loadingText}>Loading...</Typography>
      </Paper>
    );
  }
  return (
    <>
      {error && (
        <ErrorHandler
          message={error?.message ?? "Oop's, Somethings went wrong!"}
          showRetry={true}
          onRetry={() =>
            Object.keys(job).length ? handleUpdateJob() : fetchJob()
          }
        />
      )}
      <div className={classes.root}>
        <Box p={1} justifyItems="stretch" alignItems="right">
          <Button
            className={classes.button}
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={handleUpdateJob}
            children="Update Job"
            startIcon={<PublishIcon />}
          />
          <Button
            disabled={isLoading}
            color="default"
            variant="contained"
            onClick={async () => {
              try {
                await Job.update(id, { data });
                history.push("/home/jobs");
              } catch (err) {
                setError(err);
              }
            }}
            children="Restart Job"
            startIcon={<UpdateIcon />}
          />
        </Box>
        <Paper>
          {state === "finished" ? (
            <video
              poster={job.videoTemplate.thumbnail}
              style={{ height: 320, width: "100%" }}
              controls
              src={output}
            />
          ) : (
            <>
              <Box justifyContent="center" textAlign="center" height={320}>
                <Typography style={{ padding: 100 }}>
                  {" "}
                  No output yet.
                </Typography>
              </Box>
              <Divider />
            </>
          )}
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
                <p></p>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudDownloadIcon />}
                  href={output}>
                  Download Output
                </Button>
              </Box>
            </Grid>
          </TabPanel>
          <TabPanel value={activeTabIndex} index={1}>
            <MaterialTable
              style={{ boxShadow: "none" }}
              options={{
                pageSize: 10,
                headerStyle: { fontWeight: 700 },
                actionsColumnIndex: -1,
              }}
              editable={{
                onRowUpdate: async (newData, oldData) => {
                  return await handleUpdateAsset(
                    oldData.tableData.id,
                    newData.key,
                    newData.value
                  );
                },
                onRowDelete: async (oldData) => {
                  return await handleAssetDelete(oldData.tableData.id);
                },
              }}
              columns={[
                {
                  title: "Field Id",
                  field: "key",
                  editable: "never",
                },
                {
                  title: "Value",
                  field: "value",
                },
              ]}
              data={Object.keys(data).map((key) => ({
                key,
                value: data[key],
              }))}
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
    </>
  );
};
