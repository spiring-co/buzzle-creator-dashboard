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
  Link,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router-dom";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import AssetsPreview from "components/AssetsPreview";
import ErrorHandler from "components/ErrorHandler";
import AssetDialog from "components/AssetDialog";
import ActionsHandler from "components/ActionsHandler"
import formatTime from "helpers/formatTime";
import { Job } from "services/api";
import { useParams } from "react-router-dom";
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

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

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
}));

export default (props) => {
  const classes = useStyles();

  const [job, setJob] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  const { id } = useParams();
  const history = useHistory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    fetchJob();
  }, []);
  const handleAssetSubmit = (a) => {
    //TODO check if property combination already exists
    job.assets.push(a);
    setJob(job);
    setIsDialogOpen(false);
  };

  const handleDeleteAsset = (_, { layerName, property, src }) => {
    setJob({
      ...job,
      assets: job.assets.filter(
        (a) =>
          !(
            a.layerName == layerName &&
            (a.property == property || a.src === src)
          )
      ),
    });
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
      setRedirect("/home/jobs");
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

  if (redirect) return <Redirect to="/home/jobs" />;
  if (isLoading) return <CustomProgress />;
  return (
    <>
      <div className={classes.root}>
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
          <Paper>
            <Grid xs={12} item>
              {state === "finished" ? (
                <video
                  style={{ height: 320, width: "100%" }}
                  controls
                  src={output}
                />
              ) : (
                <Box
                  style={{ background: "gainsboro" }}
                  justifyContent="center"
                  textAlign="center"
                  height={320}>
                  <p style={{ padding: 100 }}> No output yet.</p>
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
          </Paper>
        </TabPanel>
        <TabPanel value={activeTabIndex} index={1}>
          <Box p={1}>
            <Button
              disabled={isLoading}
              color="secondary"
              variant="contained"
              onClick={handleUpdateJob}
              children="Update Job"
            />
          </Box>
          <MaterialTable
            options={{
              pageSize: 5,
              headerStyle: { fontWeight: 700 },
              actionsColumnIndex: -1,
            }}
            actions={[
              {
                icon: "add",
                tooltip: "Add Asset",
                isFreeAction: true,
                onClick: () => {
                  setEditIndex(null);
                  setIsDialogOpen(true);
                },
              },
              {
                icon: "edit",
                tooltip: "Edit Asset",
                onClick: (e, rowData) => {
                  setEditIndex(rowData.tableData.id);
                  setIsDialogOpen(true);
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Asset",
                onClick: handleDeleteAsset,
              },
            ]}
            columns={[
              { title: "Layer Name", field: "layerName" },
              { title: "Type", field: "type" },
              {
                title: "Property",
                render: ({ property }) => property || "Source",
              },
              {
                title: "Value/Source",
                field: "value",
                render: ({ value, src }) =>
                  src ? (
                    <Link src={src} target="_blank" children={src} />
                  ) : (
                    value
                  ),
              },
            ]}
            data={job.assets}
            title="Assets"
          />
        </TabPanel>
        <TabPanel value={activeTabIndex} index={2}>
         <ActionsHandler/>
        </TabPanel>
      </div>
      {isDialogOpen && (
        <AssetDialog
          setIsDialogOpen={setIsDialogOpen}
          editableLayers={videoTemplate?.editableLayers}
          initialValues={editIndex!==null && job.assets[editIndex]}
          onSubmit={handleAssetSubmit}
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
