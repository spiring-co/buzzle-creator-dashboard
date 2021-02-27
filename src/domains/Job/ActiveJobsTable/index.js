import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

import io from "socket.io-client";
import * as timeago from "timeago.js";
import ReactJson from "react-json-view";

import {
    Chip,
    Typography, Button,
    Container,
    Paper, Box, ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Tooltip,
    Fade,
} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import MaterialTable from "material-table";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { ExpandMore, ArrowForward, ArrowBack } from "@material-ui/icons";

import formatTime from "helpers/formatTime";
import Alert from '@material-ui/lab/Alert';
import { useDarkMode } from "helpers/useDarkMode";

import Filters from "common/Filters";
import ErrorHandler from "common/ErrorHandler";
import { Job, Search } from "services/api";

import { useAuth } from "services/auth";
import { SnackbarProvider, useSnackbar } from 'notistack';
import LogsDialog from "common/LogsDialog";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default ({ onRowClick, logsData = [], activeJobsData = [] }) => {
    const { user } = useAuth()
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [index, setSelectedIndex] = useState(0)
    useEffect(() => {
        setInterval(() => setSelectedIndex(i => i + 1), 5000)
    }, [])
    return (<>
        <ExpansionPanel defaultExpanded={false} style={{ marginBottom: 20 }}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1c-content"
                id="panel1c-header">
                <Typography variant="h6">Active Jobs</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexWrap: "wrap" }}>
                {activeJobsData?.length ? <TableContainer>
                    <Table stickyHeader size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell >Job Id</TableCell>
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
                                            label={`${state}${progress ? " " + progress + "%" : ""}`}
                                            style={{
                                                fontWeight: 700,
                                                background: getColorFromState(state, progress),
                                                color: "white",
                                                textTransform: 'capitalize'

                                            }}
                                        /></TableCell>
                                    <TableCell align="left"><Button
                                        onClick={e => {
                                            e.stopPropagation()
                                            setSelectedJobId(id)
                                        }}
                                        size="small"
                                        variant="contained" color="primary" children="view logs" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> : <Box><Typography>No Active Jobs</Typography></Box>}
            </ExpansionPanelDetails>
        </ExpansionPanel>
        {selectedJobId && <LogsDialog
            logs={logsData?.find(({ id }) => id === selectedJobId)?.logs}
            onClose={() => setSelectedJobId(null)} />}
    </>
    );
};

const getColorFromState = (state, percent) => {
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
    const {
        startDate = 0,
        endDate = 0,
        idVideoTemplates = [],
        states = [],
    } = f;

    return `${startDate
        ? `dateUpdated=>=${startDate}&${endDate ? `dateUpdated=<=${endDate || startDate}&` : ''}`
        : ""
        }${idVideoTemplates.length !== 0
            ? getArrayOfIdsAsQueryString(
                "idVideoTemplate",
                idVideoTemplates.map(({ id }) => id)
            ) + "&"
            : ""
        }${states.length !== 0 ? getArrayOfIdsAsQueryString("state", states) : ""}`;
};
