import { Button, Chip, Container, Tooltip, } from "@material-ui/core";
import { Job, VideoTemplate, Creator, ServerJobs } from "services/api";
import ErrorHandler from "common/ErrorHandler";
import { useDarkMode } from "helpers/useDarkMode";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useAuth } from "services/auth";
import io from "socket.io-client";
import Fade from '@material-ui/core/Fade';
import formatTime from "helpers/formatTime";

import * as timeago from "timeago.js";


export default () => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);
    const { path } = useRouteMatch();
    const tableRef = useRef(null);
    const [darkModeTheme] = useDarkMode();
    const { user } = useAuth();
    const history = useHistory();
    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        try {
            setData(await ServerJobs.getAll())
            setLoading(false)
        } catch (err) {
            setLoading(false)
            setError(err)
        }
    }
    const handleRetry = () => {
        setError(false);
        setLoading(true)
        init()
    };


    return (
        <Container>
            {error && (
                <ErrorHandler
                    message={error.message}
                    showRetry={error}
                    onRetry={handleRetry}
                />
            )}
            <MaterialTable
                tableRef={tableRef}
                title="Server Jobs"
                options={{
                    pageSize: 20,
                    headerStyle: { fontWeight: 700 },
                    actionsColumnIndex: -1,
                    selection: true
                }}
                onRowClick={(e, { uid }) => {
                    if (["td", "TD"].includes(e.target.tagName)) {
                        history.push(`${path.substr(0, path.lastIndexOf("/"))}/jobs/${uid}`)
                    }
                }}
                detailPanel={[
                    {
                        render: (rowData) => (
                            <ReactJson
                                displayDataTypes={false}
                                name={rowData.id}
                                collapsed={1}
                                src={rowData}
                                theme={darkModeTheme === "dark" ? "ocean" : "rjv-default"}
                            />
                        ),
                        icon: "code",
                        tooltip: "Show Code",
                    },
                ]}
                columns={[
                    {
                        title: "UID",
                        field: "uid",
                        searchable: true,

                    },
                    {
                        searchable: true,
                        title: "State",
                        field: "state",
                        render: function ({ state, }) {
                            return (
                                <Chip
                                    size="small"
                                    label={`${state}`}
                                    style={{
                                        transition: "background-color 0.5s ease",
                                        fontWeight: 700,
                                        background: getColorFromState(state),
                                        color: "white",
                                    }}
                                />
                            );
                        },
                    },
                ]}
                localization={{
                    body: {
                        emptyDataSourceMessage: error && (
                            <Button
                                onClick={handleRetry}
                                color="secondary"
                                variant="outlined"
                                children={"Retry"}
                            />
                        ),
                    },
                }}
                isLoading={loading}
                data={data}
                actions={[
                    //TODO add rerender and edit job actions
                    {
                        icon: "refresh",
                        tooltip: "Refresh Data",
                        isFreeAction: true,
                        onClick: handleRetry,
                    },
                    {
                        icon: "delete",
                        tooltip: "Delete Job",
                        position: 'row',
                        onClick: async (event, { uid }) => {
                            const action = window.confirm("Are you sure, you want to delete");
                            if (!action) return;
                            try {
                                await ServerJobs.delete(uid);
                                handleRetry()
                            } catch (err) {
                                setError(err);
                            }
                        },
                    },
                    {
                        icon: "delete",
                        tooltip: "Delete All Selected Jobs",
                        position: 'toolbarOnSelect',
                        onClick: async (e, data) => {
                            try {
                                await ServerJobs.deleteAll(data.map(({ uid }) => uid))
                            } catch (err) {
                                setError(err);
                            }
                            handleRetry()
                        },
                    }
                ]}
            />
        </Container>
    );
};

const getColorFromState = (state, percent) => {
    switch (state) {
        case "finished":
            return "#4caf50";
        case "error":
            return "#f44336";
        case "started":
            return "#fff000";
        case "rendering":
            return `linear-gradient(90deg, #ffa502 ${percent}%, grey ${percent}%)`;
        default:
            return "grey";
    }
};
