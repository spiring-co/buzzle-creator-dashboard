import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

import * as timeago from "timeago.js";
import ReactJson from "react-json-view";
import io from "socket.io-client";

import {
  Chip,
  Typography,
  Button,
  Container,
  Paper,
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Tooltip,
  Fade,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import MaterialTable from "material-table";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {
  ExpandMore,
  ArrowForward,
  ArrowBack,
  TramRounded,
} from "@material-ui/icons";

import formatTime from "helpers/formatTime";
import Alert from "@material-ui/lab/Alert";
import { useDarkMode } from "helpers/useDarkMode";

import Filters from "common/Filters";
import ErrorHandler from "common/ErrorHandler";
import { Job, Search } from "services/api";

import { useAuth } from "services/auth";
import { SnackbarProvider, useSnackbar } from "notistack";
import LogsDialog from "common/LogsDialog";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default ({ onRowClick }) => {
  // init socket on mount
  const [activeJobs, setActiveJobs] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [activeJobLogs, setActiveJobLogs] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [socket, setSocket] = useState(null);

  const status = ["Error", "Render", "Started"];

  useEffect(() => {
    setSocket(
      io.connect(process.env.REACT_APP_SOCKET_SERVER_URL, {
        withCredentials: false,
      })
    );
  }, []);

  useEffect(() => {
    if (!socket) {
      return console.log("no socket");
    }
    socket.on("job-progress", ({ id, state, progress, server }) => {
      setActiveJobs((activeJobs) => {
        const index = activeJobs.map(({ id }) => id).indexOf(id);
        if (index === -1) {
          return [...activeJobs, { id, state, progress, server }];
        } else
          return activeJobs?.map((data) =>
            data.id === id ? { id, state, progress, server } : data
          );
      });
    });
    socket.on("job-logs", ({ id, logs }) => {
      setActiveJobLogs((activeJobLogs) => {
        const index = activeJobLogs.map(({ id }) => id).indexOf(id);
        if (index === -1) {
          return [...activeJobLogs, { id, logs }];
        } else
          return activeJobLogs?.map((log) =>
            log.id === id ? { id, logs } : log
          );
      });
    });
    socket.on("job-status", (data) => {
      const { started, error } = data;
      const render = data["render:postrender"];
      setPendingJobs([error, render, started]);
    });
  }, [socket]);

  useEffect(() => {
    if (activeJobs?.length && jobsData?.length !== activeJobs?.length) {
      //fetch and setJobs
      const jobIdToBeFetched = activeJobs.find(
        (j) => !jobsData.map(({ id }) => id).includes(j?.id)
      )?.id;

      if (jobIdToBeFetched) {
        console.log("Fetching job:", jobIdToBeFetched);
        Job.get(jobIdToBeFetched, true)
          .then((d) =>
            setJobsData((j) => [...j, { ...d, id: jobIdToBeFetched }])
          )
          .catch(() => setJobsData((j) => [...j, { id: jobIdToBeFetched }]));
      }
    }
  }, [activeJobs, jobsData]);
  useEffect(() => {
    const finishedJobs = activeJobs?.filter(
      ({ state = "" }) => state.toLowerCase() !== "finished"
    );
    let timeout = null;
    if (
      finishedJobs?.length &&
      activeJobs.find(({ state = "" }) => state.toLowerCase() === "finished")
    ) {
      timeout = setTimeout(() => {
        setActiveJobs(finishedJobs);
        setJobsData((d) =>
          d?.filter(({ id }) => finishedJobs.map(({ id }) => id).includes(id))
        );
      }, 5000);
    }
  }, [activeJobs]);

  useEffect(() => {
    console.log(pendingJobs);
  }, [pendingJobs]);

  const ActiveJobRow = ({ id, state, progress, jobData }) => {
    return (
      <TableRow key={id} onClick={() => onRowClick(id)}>
        <TableCell component="th" scope="row">
          {id}
        </TableCell>
        <TableCell align="left">
          {jobData?.videoTemplate?.title || "loading..."}
        </TableCell>
        <TableCell>
          {jobData?.videoTemplate?.versions?.find(
            (v) => v?.id === jobData?.idVersion
          )?.title || "loading..."}
        </TableCell>
        <TableCell>
          {timeago.format(new Date(jobData?.dateUpdated)) || "loading..."}
        </TableCell>
        <TableCell>
          {timeago.format(new Date(jobData?.dateCreated)) || "loading..."}
        </TableCell>
        <TableCell align="left">
          <Chip
            size="small"
            label={`${state}${progress ? " " + progress + "%" : ""}`}
            style={{
              fontWeight: 700,
              background: getColorFromState(state, progress),
              color: "white",
              textTransform: "capitalize",
            }}
          />
        </TableCell>
        <TableCell align="left">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJobId(id);
            }}
            size="small"
            variant="contained"
            color="primary"
            children="view logs"
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <ExpansionPanel defaultExpanded={true} style={{ marginBottom: 20 }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header">
          <Typography variant="h6">Active Jobs</Typography>
          <Button
            style={{ marginLeft: 25 }}
            variant="contained"
            size="small"
            color="primary"
            children={"clear"}
            onClick={(e) => {
              e.stopPropagation();
              setActiveJobs([]);
            }}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexWrap: "wrap" }}>
          {activeJobs?.length ? (
            <TableContainer>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Job Id</TableCell>
                    <TableCell align="left">Video template</TableCell>
                    <TableCell align="left">Version</TableCell>
                    <TableCell align="left">Last updated</TableCell>
                    <TableCell align="left">Created at</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeJobs.map(({ id, state, progress }) => (
                    <ActiveJobRow
                      id={id}
                      state={state}
                      progress={progress}
                      jobData={jobsData?.find((j) => j.id === id) || []}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              <Typography>No Active Jobs</Typography>
            </Box>
          )}
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          {pendingJobs?.length ? (
            <TableContainer>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Number of Jobs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {status.map((s,i) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {s}
                      </TableCell>
                      <TableRow>
                      <TableCell component="th" scope="row">
                        {pendingJobs[i]}
                      </TableCell>
                    </TableRow>
                    </TableRow>
                  ))}
                 
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            ""
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {selectedJobId !== null && (
        <LogsDialog
          logs={activeJobLogs?.find(({ id }) => id === selectedJobId)?.logs}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </>
  );
};

const getColorFromState = (state = "", percent) => {
  switch (state.toLowerCase()) {
    case "finished":
      return "#4caf50";
    case "error":
      return "#f44336";
    case "started":
      return "#ffa502";
    case "rendering":
      return `linear-gradient(90deg, #ffa502 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};

const getArrayOfIdsAsQueryString = (field, ids) => {
  return ids
    .map((id, index) => `${index === 0 ? "" : "&"}${field}[]=${id}`)
    .toString()
    .replace(/,/g, "");
};
const filterObjectToString = (f) => {
  if (!f) return null;
  const { startDate = 0, endDate = 0, idVideoTemplates = [], states = [] } = f;

  return `${
    startDate
      ? `dateUpdated=>=${startDate}&${
          endDate ? `dateUpdated=<=${endDate || startDate}&` : ""
        }`
      : ""
  }${
    idVideoTemplates.length !== 0
      ? getArrayOfIdsAsQueryString(
          "idVideoTemplate",
          idVideoTemplates.map(({ id }) => id)
        ) + "&"
      : ""
  }${states.length !== 0 ? getArrayOfIdsAsQueryString("state", states) : ""}`;
};

//job-status for job statoos
