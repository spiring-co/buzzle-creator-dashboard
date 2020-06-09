import React, { useState, useRef, useEffect } from "react";
import { Chip, Link, CircularProgress, Button } from "@material-ui/core";
import MaterialTable from "material-table";
import {
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom";
import ErrorHandler from "components/ErrorHandler";

import { Alert } from "@material-ui/lab";
import { Delete } from "@material-ui/icons";
import { Job } from "services/api";
import ReactJson from "react-json-view";
import io from "socket.io-client";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/jobs`;

function JobState({ id, state }) {

  const [status, setStatus] = useState(state)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const nsp = io(`http://localhost:8080/${id}`);
    nsp.on("progress", p => {
      console.log(p)
      // to re-render if previously state was created
      setStatus("started")
      setProgress(p)
    });
    nsp.on("finished", () => setStatus("finished"));
    // return () => status === "finished" ? io.removeAllListeners() : true
  }, []);

  if (!(status === "started"))
    return (
      <Chip
        size="small"
        label={status}
        style={{
          fontWeight: 700,
          background: getColorFromState(status),
          color: "white",
        }}
      />
    );

  return (
    <Chip
      size="small"
      label={`Rendering - ${progress}%`}
      style={{
        fontWeight: 700,
        background: getColorFromState('started'),
        color: "white",
      }}
    />
  );
}


export default () => {
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  let history = useHistory();
  let { path } = useRouteMatch();
  const tableRef = useRef(null);
  const handleRetry = () => {
    setError(false)
    tableRef.current && tableRef.current.onQueryChange()
  }

  return (
    <>
      {error && (
        <ErrorHandler
          message={error.message}
          showRetry={true}
          onRetry={handleRetry}
        />
      )}
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
        localization={{
          body: {
            emptyDataSourceMessage: error && <Button
              onClick={handleRetry}
              color="secondary" variant="outlined" children={"retry?"} />
          },
        }}
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
            }).catch(e => {
              setError(e)
              return { data: [], page: query.page, totalCount: 0 }
            })
        }
        actions={[
          //TODO add rerender and edit job actions
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: handleRetry,
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
