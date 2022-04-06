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
import AddBoxIcon from "@material-ui/icons/AddBox";
import HdIcon from "@material-ui/icons/Hd";
import UpdateIcon from "@material-ui/icons/Update";
import DownloadIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import MaterialTable from "material-table";
import io from "socket.io-client";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import formatTime from "helpers/formatTime";

import ActionsHandler from "./ActionsHandler";
import AlertHandler from "common/AlertHandler";
import ImageEditRow from "./ImageEditRow";
import TextEditRow from "./TextEditRow";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useAPI } from "services/APIContext";
import LogsTab from "./LogsTab";
import FileUploader from "common/FileUploader";
import { useConfig } from "services/RemoteConfigContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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
  const { Job } = useAPI()
  const { socketURL } = useConfig()
  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [selectedOutputIndex, setSelectedOutputIndex] = useState(0);

  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();

  // fetch job on init
  useEffect(() => {
    fetchJob();
  }, []);

  // rerender on output select
  useEffect(() => { }, [selectedOutputIndex]);

  // init socket on mount
  useEffect(() => {
    setSocket(io.connect(socketURL || process.env.REACT_APP_SOCKET_SERVER_URL), {
      withCredentials: true,
    });
  }, []);

  function subscribeToProgress(jobId) {
    if (!socket) return;
    socket.on(
      "job-progress",
      ({ id, state, progress, server }) =>
        jobId === id && setProgress({ id, state, progress, server })
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
  }, [id, socket]);

  const fetchJob = async () => {
    try {
      setError(false);
      setIsLoading(true);
      setJob(await Job.get(id, "fields=idVideoTemplate videoTemplate"));
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };


  const handleUpdateJob = async () => {
    try {
      const { data, actions, id, renderPrefs } = job;
      setIsLoading(true);
      await Job.update(id, { data, actions, renderPrefs }, { noMessage: true });
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
        }
      >
        <Chip
          size="small"
          label={`${state}${percent ? " " + percent + "%" : ""}`}
          style={{
            transition: "background-color 0.5s ease",
            fontWeight: 700,
            background: getColorFromState(state, percent),
            color: "white",
            textTransform: "capitalize",
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
    timeline = [],
  } = job;
  const sortedOutput = output?.sort(
    (a, b) => new Date(b?.dateCreated) - new Date(a?.dateCreated)
  );
  useEffect(() => {
    if (
      progress?.state?.toLowerCase() === "finished" &&
      state?.toLowerCase() !== "finished"
    ) {
      fetchJob();
    }
  }, [progress?.state, state]);

  const content = {
    "Job ID": id,
    State: progressShow(
      failureReason,
      progress?.state ?? state,
      progress?.progress
    ),
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
    const idArray = Object.keys(data);
    job.data[idArray[index]] = value;
    setJob({ ...job, data: job.data });
  };
  const renderJobInHd = async () => {
    try {
      if (
        actions?.postrender?.find(
          ({ module }) =>
            module === "buzzle-action-merge-videos" ||
            module === "action-merge-videos"
        )
      ) {
        return alert("This Job has merge video action!, Request failed");
      }
      const { data, actions, id } = job;
      setIsLoading(true);
      await Job.update(id, {
        data,
        actions,
        state: "created",
        renderPrefs: { settingsTemplate: "full" },
        extra: {
          forceRerender: true,
        },
      });
      setIsLoading(false);
      setRedirect("/home/jobs");
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
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
        <AlertHandler
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
                  await Job.update(id, {
                    state: "created",
                    data,
                    actions,
                    renderPrefs,
                    extra: {
                      forceRerender: true,
                    },
                  });
                  history.push("/home/jobs");
                } catch (err) {
                  setError(err);
                }
              }}
              children="Restart Job"
              startIcon={<UpdateIcon />}
            />
            <Button
              disabled={isLoading}
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={async () => {
                try {
                  await Job.update(
                    id,
                    {
                      state: "created",
                      data,
                      actions,
                      renderPrefs,
                    },
                    { priority: 5 }
                  );
                  history.push("/home/jobs");
                } catch (err) {
                  setError(err);
                }
              }}
              children="Update & Restart (Priority)"
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
                setSelectedOutputIndex(e.target.value);
              }}
            >
              {sortedOutput?.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o.label}
                  <Typography
                    style={{ marginLeft: 10 }}
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    {new Date(o.dateCreated).toLocaleString()}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
            <IconButton
              onClick={handleDeleteJob}
              aria-label="delete"
              className={classes.margin}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              onClick={renderJobInHd}
              aria-label="delete"
              className={classes.margin}
            >
              <HdIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="download"
              className={classes.margin}
              onClick={() =>
                window.open(
                  sortedOutput?.length && sortedOutput[selectedOutputIndex]?.src
                )
              }
            >
              <DownloadIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        {/* output */}
        <Paper>
          {state === "finished" ? (
            <video
              poster={job?.videoTemplate?.thumbnail}
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
              aria-label="simple tabs example"
            >
              <Tab label="Output" {...a11yProps(0)} />
              <Tab label="Data" {...a11yProps(1)} />
              <Tab label="Actions" {...a11yProps(2)} />
              <Tab label="Render Prefs" {...a11yProps(3)} />
              <Tab label="Logs" {...a11yProps(3)} />
            </Tabs>
          </AppBar>

          {/* Details tab */}
          <TabPanel value={activeTabIndex} index={0}>
            <Grid xs={12} item>
              <Box p={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                  startIcon={<AddBoxIcon />}
                  style={{ marginBottom: 10 }}
                >
                  Add Output
                </Button>
                <Dialog onClose={() => setOpen(false)} open={open}>
                  <div style={{ margin: 10 }}>
                    <DialogTitle>Add output</DialogTitle>
                    <FileUploader
                      name={"watermarkFile"}
                      value={""}
                      storageType="deleteAfter90Days"
                      onError={(e) => console.log(e.message)}
                      onChange={(src) => {
                        job.output = [
                          ...job.output,
                          {
                            label: "Added Manually",
                            updatedAt: new Date().toISOString(),
                            dateCreated: new Date().toISOString(),
                            src,
                          },
                        ];
                        setJob(job);
                      }}
                      accept={"video/*"}
                      uploadDirectory={"outputs"}
                      label="Add output"
                      onTouched={() => console.log("Pressed")}
                      error={false}
                      helperText={"This will append new output to this job"}
                    />
                  </div>
                </Dialog>
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

                <Accordion style={{ marginTop: 20 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Render Timeline</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Timeline align="alternate">
                      {timeline.length ? (
                        timeline.map(({ state, startsAt, endsAt }, index) => (
                          <TimelineItem>
                            {index !== 0 && timeline?.length - 1 !== index && (
                              <TimelineOppositeContent>
                                <Typography color="textSecondary">
                                  {((endsAt - startsAt) / 1000).toFixed(2)} secs
                                </Typography>
                              </TimelineOppositeContent>
                            )}
                            <TimelineSeparator>
                              <TimelineDot
                                style={{
                                  backgroundColor:
                                    index === 0
                                      ? "#ffa117"
                                      : index !== timeline?.length - 1
                                        ? "#35a0f4"
                                        : "#65ba68",
                                }}
                              />
                              {timeline?.length - 1 !== index && (
                                <TimelineConnector />
                              )}
                            </TimelineSeparator>
                            <TimelineContent>
                              <span>{state}</span>
                            </TimelineContent>
                          </TimelineItem>
                        ))
                      ) : (
                        <Typography>Not Available</Typography>
                      )}
                    </Timeline>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </TabPanel>

          {/* data tab  */}
          <TabPanel value={activeTabIndex} index={1}>
            <MaterialTable
              style={{ boxShadow: "none" }}
              options={{
                pageSize: 30,
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
                    const version = job?.videoTemplate?.versions.find(
                      (v) => v?.id === job?.idVersion
                    );
                    const field = version?.fields?.find((f) => f?.key === key);
                    return <span>{field?.label}</span>;
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
                  title: "valid length/format",
                  render: ({ value, key }) => {
                    const version = job.videoTemplate.versions.find(
                      (v) => v.id === job.idVersion
                    );
                    const v = value.startsWith("http")
                      ? version.fields.find((f) => f.key === key)?.rendererData
                        ?.extension ?? "png"
                      : version.fields.find((f) => f.key === key)?.constraints
                        ?.maxLength;
                    return <span>{v}</span>;
                  },
                  editable: "never",
                },
                {
                  title: "Value",
                  field: "value",
                  render: ({ value, key }) => {
                    const version = job.videoTemplate.versions.find(
                      (v) => v.id === job.idVersion
                    );
                    const isValid = value.startsWith("http")
                      ? value.split(".").pop() ===
                      (version.fields.find((f) => f.key === key)?.rendererData
                        ?.extension ?? "png")
                      : value.length <=
                      version.fields.find((f) => f.key === key)?.constraints
                        ?.maxLength;
                    return (
                      <Typography color={isValid ? "textPrimary" : "secondary"}>
                        {value}
                      </Typography>
                    );
                  },
                  editComponent: ({
                    rowData: { key, constraints },
                    onChange,
                    value,
                  }) => {
                    const version = job.videoTemplate.versions.find(
                      (v) => v.id === job.idVersion
                    );
                    const {
                      constraints: { height = 100, width = 100, maxLength },
                      rendererData: { extension = "png" },
                    } = version.fields.find((f) => f.key === key);
                    if (
                      value?.startsWith("http://") ||
                      value?.startsWith("https://")
                    ) {
                      return (
                        <ImageEditRow
                          name={key}
                          value={value}
                          extension={extension}
                          onChange={onChange}
                          height={height}
                          width={width}
                        />
                      );
                    } else {
                      return (
                        <TextEditRow
                          maxLength={maxLength}
                          value={value}
                          onChange={onChange}
                        ></TextEditRow>
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
                    case "buzzle-action-handbrake":
                      return { compress: action };
                    case "buzzle-action-watermark":
                      return { addWatermark: action };
                    case "buzzle-action-add-thumbnail":
                      return { addThumbnail: action };
                    case "buzzle-action-upload":
                      return { upload: action };
                    case "buzzle-action-add-audio":
                      return { addAudio: action };
                    case "buzzle-action-merge-videos":
                      return { mergeVideos: action };
                    case "buzzle-action-video-orientation":
                      return { rotateAction: action };
                    default:
                      return {};
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
                  onChange={({ target: { value } }) =>
                    setJob({
                      ...job,
                      renderPrefs: {
                        ...job?.renderPrefs,
                        settingsTemplate: value,
                      },
                    })
                  }
                  inputProps={{
                    name: "settingsTemplate",
                    id: "settingsTemplate",
                  }}
                >
                  <MenuItem aria-label="None" value="" />
                  <MenuItem value={"half"}>Half</MenuItem>
                  <MenuItem value={"full"}>Full</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="outputModule">Output module</InputLabel>
                <Select
                  value={job.renderPrefs?.outputModule || ""}
                  onChange={({ target: { value } }) =>
                    setJob({
                      ...job,
                      renderPrefs: { ...job?.renderPrefs, outputModule: value },
                    })
                  }
                  inputProps={{
                    name: "outputModule",
                    id: "outputModule",
                  }}
                >
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
          <TabPanel value={activeTabIndex} index={4}>
            <LogsTab logs={job?.logs ?? []} />
          </TabPanel>
        </Paper>
      </div>
    </>
  );
};

const getColorFromState = (state = "", percent) => {
  switch (state?.toLowerCase()) {
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
