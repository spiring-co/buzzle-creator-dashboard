import {
  Box,
  Button,
  Chip,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ExpandMore } from "@material-ui/icons";
import LogsDialog from "common/LogsDialog";
import React, { useEffect, useState } from "react";

export default ({ onRowClick, logsData = [], activeJobsData = [] }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [index, setSelectedIndex] = useState(0);
  useEffect(() => {
    setInterval(() => setSelectedIndex((i) => i + 1), 5000);
  }, []);

  return (
    <>
      <ExpansionPanel defaultExpanded={true} style={{ marginBottom: 20 }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header">
          <Typography variant="h6">Active Jobs</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexWrap: "wrap" }}>
          {activeJobsData?.length ? (
            <TableContainer>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Job Id</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeJobsData.map(({ id, state, progress = 0 }) => (
                    <TableRow key={id} onClick={() => onRowClick(id)}>
                      <TableCell component="th" scope="row">
                        {id}
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          size="small"
                          label={`${state}${
                            progress ? " " + progress + "%" : ""
                          }`}
                          style={{
                            fontWeight: 700,
                            background: getColorFromState(state, progress),
                            color: "white",
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
      </ExpansionPanel>
      {selectedJobId && (
        <LogsDialog
          logs={logsData?.find(({ id }) => id === selectedJobId)?.logs}
          onClose={() => setSelectedJobId(null)}
        />
      )}
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
      return `linear-gradient(90deg, #ffa502 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};