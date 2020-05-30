import React, { useState, useRef } from "react";
import { Chip, Link, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";
import {
    useRouteMatch,
    useHistory,
    Link as RouterLink,
} from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { Delete } from "@material-ui/icons";
import { deleteJob } from "services/api";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
    "creatorId"
)}/jobs`;

export default () => {
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    let history = useHistory();
    let { path } = useRouteMatch();
    const tableRef = useRef(null);
    return (
        <>
            {error && (
                <Alert
                    severity="error"
                    children={`Failed to fetch records ${error.message}`}
                />
            )}

            <MaterialTable
                tableRef={tableRef}
                title="Your Jobs"
                options={{
                    pageSize: 8,
                    headerStyle: { fontWeight: 700 },
                    minBodyHeight: 500,
                    actionsColumnIndex: -1,
                }}
                columns={[
                    { title: "Job Id", field: "id" },
                    {
                        title: "Video Template Id",
                        render: ({ idVideoTemplate }) => (
                            <Link as={RouterLink} to={`/videTemplates/${idVideoTemplate}`}>
                                {idVideoTemplate}
                            </Link>
                        ),
                        field: "idVideoTemplate",
                    },
                    { title: "Version Id", field: "idVersion" },
                    { title: "Created At", field: "dateCreated", type: "datetime" },
                    {
                        title: "State",
                        field: "state",
                        render: ({ state }) => (
                            <Chip
                                size="small"
                                label={state}
                                style={{ background: getColorFromState(state), color: "white" }}
                            />
                        ),
                    },
                ]}
                data={(query) =>
                    fetch(`${uri}?page=${query.page + 1}&size=${query.pageSize}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwtoken")}`,
                        },
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            const { jobs = [], message = "", totalCount } = result;
                            if (message) {
                                setError(new Error(message));
                            }
                            return { data: jobs, page: query.page, totalCount };
                        })
                }
                onRowClick={(e, rowData) => {
                    e.preventDefault();
                    history.push(`${path}${rowData.id}`, {
                        jobDetails: rowData,
                    });
                }}
                actions={[
                    //TODO add rerender and edit job actions
                    {
                        icon: "refresh",
                        tooltip: "Refresh Data",
                        isFreeAction: true,
                        onClick: () => tableRef.current && tableRef.current.onQueryChange(),
                    },
                    {
                        icon: () =>
                            isDeleting ? <CircularProgress size={20} /> : <Delete />,
                        tooltip: "Delete Template",
                        disabled: isDeleting,
                        onClick: async (event, rowData) => {
                            const action = window.confirm("Are you sure, you want to delete");
                            if (!action) return;
                            try {
                                setIsDeleting(true);
                                const response = await deleteJob(rowData.id);
                                setIsDeleting(false);
                                if (response.ok) {
                                    tableRef.current && tableRef.current.onQueryChange();
                                } else {
                                    throw new Error((await response.json()).message);
                                }
                            } catch (err) {
                                setIsDeleting(false);
                                setError(new Error(err.message));
                            }
                        },
                    },
                ]}
            />
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
