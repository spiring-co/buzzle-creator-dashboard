import React, { useState, useRef, useEffect } from "react";
import { Chip, Link, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";
import {
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { Delete } from "@material-ui/icons";
import { Job } from "services/api";
import ReactJson from "react-json-view";
import io from "socket.io-client";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/jobs`;
export default () => {
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  let history = useHistory();
  let { path } = useRouteMatch();
  const tableRef = useRef(null);

  function JobState({ id, state }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const nsp = io(`http://localhost:8080/${id}%`);
      nsp.on("progress", setProgress);
      // return () => io.removeAllListeners();
    });

    if (!(state === "started"))
      return (
        <Chip
          size="small"
          label={state}
          style={{
            fontWeight: 700,
            background: getColorFromState(state),
            color: "white",
          }}
        />
      );

    return (
      <Chip
        size="small"
        label={`Rendering ${progress}`}
        style={{
          fontWeight: 700,
          background: getColorFromState(state),
          color: "white",
        }}
      />
    );
  }

  return (
    <>
      {error && (
        <Alert
          severity="error"
          children={`Failed to fetch records ${error.message}`}
        />
      )}
      {progress && <p>{JSON.stringify(progress, null, 2)}</p>}
      <MaterialTable
        tableRef={tableRef}
        title="Your Jobs"
        options={{
          pageSize: 10,
          headerStyle: { fontWeight: 700 },
          minBodyHeight: 500,
          actionsColumnIndex: -1,
        }}
        detailPanel={[
          {
            render: (rowData) => (
              <ReactJson
                displayDataTypes={false}
                name={rowData.id}
                collapsed={1}
                src={rowData}
              />
            ),
            icon: "code",
            tooltip: "Show Code",
          },
        ]}
        columns={[
          {
            title: "Job Id",
            field: "id",
            render: ({ id }) => (
              <Link component={RouterLink} to={`${path}${id}`}>
                {id}
              </Link>
            ),
          },
          {
            title: "Video Template Id",
            render: ({ idVideoTemplate }) => (
              <Link
                component={RouterLink}
                to={`/home/videoTemplates/${idVideoTemplate}`}>
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
            render: ({ id, state }) => <JobState id={id} state={state} />,
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
        actions={[
          //TODO add rerender and edit job actions
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
          },
          {
            icon: "repeat",
            tooltip: "Restart Job",
            onClick: async (e, { id, assets, actions }) => {
              try {
                await Job.update(id, { assets, actions });
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
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
                await Job.delete(rowData.id);
                setIsDeleting(false);
                tableRef.current && tableRef.current.onQueryChange();
              } catch (err) {
                setIsDeleting(false);
                setError(err);
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
