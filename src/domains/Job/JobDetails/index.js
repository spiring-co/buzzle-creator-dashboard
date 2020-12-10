import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Chip,
  Tab,
  Tabs,
  Tooltip,
  Fade,
  TextField,
  Typography,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import DownloadIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles } from "@material-ui/core/styles";

import MaterialTable from "material-table";
import io from "socket.io-client";

import formatTime from "helpers/formatTime";

import ActionsHandler from "common/ActionsHandler";
import ErrorHandler from "common/ErrorHandler";
import ImageEditRow from "./ImageEditRow";

import { Job } from "services/api";

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
  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [socket, setSocket] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [rtProgressData, setRtProgressData] = useState({});
  const [selectedOutputIndex, setSelectedOutputIndex] = useState(0);

  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();

  // fetch job on init
  useEffect(() => {
    fetchJob();
  }, []);

  // rerender on output select
  useEffect(() => {}, [selectedOutputIndex]);

  // init socket on mount
  useEffect(() => {
    setSocket(io.connect(process.env.REACT_APP_EVENTS_SOCKET_URL));
  }, []);

  function subscribeToProgress(id) {
    if (!socket) return;
    socket.on(id, (data) =>
      setRtProgressData({ ...rtProgressData, [id]: data })
    );
  }

  function unsubscribeFromProgress() {
    if (!socket) return;
    socket.off(id);
  }

  useEffect(() => {
    subscribeToProgress(id);
    return () => {
      unsubscribeFromProgress();
    };
  }, [id]);

  const fetchJob = async () => {
    try {
      setError(false);
      setIsLoading(true);
      setJob(await Job.get(id, true));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    try {
      const { data, actions, id, renderPrefs } = job;
      setIsLoading(true);
      await Job.update(id, { data, actions, renderPrefs });
      setIsLoading(false);
      setRedirect("/home/jobs");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const { id } = job;
      setIsLoading(true);
      await Job.delete(id);
      setIsLoading(false);
      setRedirect("/home/jobs");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  const progressShow = (failureReason, state, percent) => {
    return (
      <Tooltip
        TransitionComponent={Fade}
        title={
          state === "error"
            ? failureReason
              ? failureReason
              : "Reason not given"
            : "finished/inProgress"
        }>
        <Chip
          size="small"
          label={`${state}${percent ? " " + percent + "%" : ""}`}
          style={{
            transition: "background-color 0.5s ease",
            fontWeight: 700,
            background: getColorFromState(state, percent),
            color: "white",
          }}
        />
      </Tooltip>
    );
  };

  const {
    output = [],
    state,
    actions,
    data,
    renderTime,
    queueTime,
    dateCreated,
    dateFinished,
    renderPrefs = {},
    dateStarted,
    failureReason,
  } = job;
  const sortedOutput = output?.sort(
    (a, b) => new Date(b?.dateCreated) - new Date(a?.dateCreated)
  );
  let percent = rtProgressData[id]?.percent;

  const content = {
    "Job ID": id,
    State: progressShow(failureReason, state, percent),
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

  if (redirect) {
    return <Redirect to="/home/jobs" />;
  }

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
          message={error?.message ?? "Somethings went wrong!"}
          showRetry={true}
          onRetry={() =>
            Object.keys(job).length ? handleUpdateJob() : fetchJob()
          }
        />
      )}
      <div className={classes.root}>
        {/* actions bar  */}
        <Box display="flex">
          <Box p={1} justifyItems="stretch" alignItems="right" flex={1}>
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
              color="white"
              variant="contained"
              className={classes.button}
              onClick={async () => {
                try {
                  await Job.update(id, { data, actions, renderPrefs });
                  history.push("/home/jobs");
                } catch (err) {
                  setError(err);
                }
              }}
              children="Restart Job"
              startIcon={<UpdateIcon />}
            />
          </Box>

          <Box>
            <Select
              margin="dense"
              variant="outlined"
              className={classes.button}
              value={selectedOutputIndex}
              autoWidth
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedOutputIndex(e.target.value);
              }}>
              {sortedOutput?.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o.label}
                  <Typography
                    style={{ marginLeft: 10 }}
                    component="span"
                    variant="body2"
                    color="textSecondary">
                    {new Date(o.dateCreated).toLocaleString()}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
            <IconButton
              onClick={handleDeleteJob}
              aria-label="delete"
              className={classes.margin}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="download"
              className={classes.margin}
              href={
                sortedOutput?.length && sortedOutput[selectedOutputIndex]?.src
              }>
              <DownloadIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        {/* output */}
        <Paper>
          {state === "finished" ? (
            <video
              poster={job.videoTemplate?.thumbnail}
              style={{ height: 320, width: "100%" }}
              controls
              src={sortedOutput.length && sortedOutput[selectedOutputIndex].src}
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
              <Tab label="Data" {...a11yProps(1)} />
              <Tab label="Actions" {...a11yProps(2)} />
              <Tab label="Render Prefs" {...a11yProps(3)} />
            </Tabs>
          </AppBar>

          {/* Details tab */}
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

          {/* data tab  */}
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
                  title: "Label",
                  render: ({ key }) => {
                    const version = job.videoTemplate.versions.find(
                      (v) => v.id === job.idVersion
                    );
                    const field = version.fields.find((f) => f.key === key);
                    return <span>{field.label}</span>;
                  },
                  editable: "never",
                },
                {
                  title: "Type",
                  render: ({ value }) => {
                    return (
                      <span>
                        {value.startsWith("http://") ||
                        value.startsWith("https://")
                          ? "image"
                          : "string"}
                      </span>
                    );
                  },
                  editable: "never",
                },
                {
                  title: "Value",
                  field: "value",
                  editComponent: ({ rowData: { key }, onChange, value }) => {
                    if (
                      value.startsWith("http://") ||
                      value.startsWith("https://")
                    ) {
                      const version = job.videoTemplate.versions.find(
                        (v) => v.id === job.idVersion
                      );
                      const {
                        constraints: { height = 100, width = 100 },
                      } = version.fields.find((f) => f.key === key);
                      console.log(height, width);
                      return (
                        <ImageEditRow
                          value={value}
                          onChange={onChange}
                          height={height}
                          width={width}
                        />
                      );
                    } else {
                      return (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={(e) => onChange(e?.target?.value)}
                        />
                      );
                    }
                  },
                },
              ]}
              data={Object.keys(data || {}).map((key) => ({
                key,
                value: data[key],
              }))}
              title="Data"
            />
          </TabPanel>

          {/* actions tab  */}
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

          {/* render settings tab */}
          <TabPanel value={activeTabIndex} index={3}>
            <Box display="flex" flexDirection="column" px={8}>
              <FormControl>
                <InputLabel htmlFor="settingsTemplate">
                  Settings Template
                </InputLabel>
                <Select
                  value={job.renderPrefs?.settingsTemplate || ""}
                  // onChange={v => setJob({})}
                  inputProps={{
                    name: "settingsTemplate",
                    id: "settingsTemplate",
                  }}>
                  <MenuItem aria-label="None" value="" />
                  <MenuItem value={"half"}>Half</MenuItem>
                  <MenuItem value={"full"}>Full</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="outputModule">
                  Settings Template
                </InputLabel>
                <Select
                  value={job.renderPrefs?.outputModule || ""}
                  // onChange={v => setJob({})}
                  inputProps={{
                    name: "outputModule",
                    id: "outputModule",
                  }}>
                  <MenuItem aria-label="None" value="" />
                  <MenuItem value={"h264"}>H264</MenuItem>
                </Select>
              </FormControl>
              <TextField
                value={job.renderPrefs?.incrementFrame || ""}
                id="incrementFrame"
                label="Increment Frame"
                type="number"
              />
              <TextField
                value={job.renderPrefs?.frameStart || ""}
                // onChange={}
                id="frameStart"
                label="Start Frame"
                type="number"
              />
              <TextField
                value={job.renderPrefs?.frameEnd || ""}
                // onChange={}
                id="frameEnd"
                label="End Frame"
                type="number"
              />
            </Box>
          </TabPanel>
        </Paper>
      </div>
    </>
  );
};

const getColorFromState = (state, percent) => {
  switch (state) {
    case "finished":
      return "#4caf50";
    case "error":
      return "#f44336";
    case "started":
      return "#ffa502";
    case "rendering":
      return `linear-gradient(90deg, #4caf50 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};
