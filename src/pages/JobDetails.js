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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import DownloadIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import UpdateIcon from "@material-ui/icons/Update";
import { Job, VideoTemplate, Creator } from "services/api";
import ActionsHandler from "components/ActionsHandler";
import ErrorHandler from "components/ErrorHandler";
import ImageEditRow from "components/ImageEditRow";
import formatTime from "helpers/formatTime";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import * as timeago from "timeago.js";

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
  const [selectedOutputIndex, setSelectedOutputIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => { }, [selectedOutputIndex]);

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
              {output.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o.label}
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary">
                    {" " + timeago.format(new Date(o.dateCreated))}
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
              href={output.length && output[selectedOutputIndex].src}>
              <DownloadIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
        <Paper>
          {state === "finished" ? (
            <video
              poster={job.videoTemplate.thumbnail}
              style={{ height: 320, width: "100%" }}
              controls
              src={output.length && output[selectedOutputIndex].src}
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
            {/* onSubmit={(values) => setJob({ ...job, renderPrefs: values })} */}
          </TabPanel>
        </Paper>
      </div>
    </>
  );
};
// settingsTemplate,
// outputModule,
// outputExt,
// frameEnd,
// frameStart,
// incrementFrame,
