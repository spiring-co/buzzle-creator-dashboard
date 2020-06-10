import React, { useState, useRef, useEffect } from "react";
import { Chip, Link, CircularProgress, Button } from "@material-ui/core";
import MaterialTable from "material-table";
import {
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom";
import ErrorHandler from "components/ErrorHandler";

import { Delete } from "@material-ui/icons";
import { Job } from "services/api";
import ReactJson from "react-json-view";
import io from "socket.io-client";
import * as timeago from "timeago.js";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/jobs`;

export default () => {
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});
  // should do this with tableRef if possible
  const [jobIds, setJobIds] = useState([]);
  let history = useHistory();
  let { path } = useRouteMatch();

  const tableRef = useRef(null);
  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };

  useEffect(() => {
    setSocket(io.connect(`http://localhost:8080`));
    return () => {
      io.disconnect();
    };
  }, []);

  function subscribeToProgress(id) {
    if (!socket) return;
    console.log("Listening for " + id);
    socket.on(id, (data) =>
      setRtProgressData({ ...rtProgressData, [id]: data })
    );
  }

  function unsubscribeFromProgress() {
    if (!socket) return;
    jobIds.map(socket.off);
  }

  useEffect(() => {
    jobIds.map(subscribeToProgress);

    return () => {
      unsubscribeFromProgress();
    };
  }, [jobIds]);

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
          {
            title: "Created",
            field: "dateCreated",
            type: "datetime",
            render: ({ dateCreated }) => (
              <p>{timeago.format(new Date(dateCreated))}</p>
            ),
          },
          {
            title: "State",
            field: "state",
            render: function ({ id, state }) {
              state = rtProgressData[id]?.state || state;
              let percent = rtProgressData[id]?.percent;
              return (
                <Chip
                  size="small"
                  label={`${state}${percent ? " " + percent + "%" : ""}`}
                  style={{
                    transition: "background-color 0.5s ease",
                    fontWeight: 700,
                    background: getColorFromState(state, percent),
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
                children={"retry?"}
              />
            ),
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

              setJobIds(jobs.map(({ id }) => id));
              return { data: jobs, page: query.page, totalCount };
            })
            .catch((e) => {
              setError(e);
              return { data: [], page: query.page, totalCount: 0 };
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

const getColorFromState = (state, percent) => {
  switch (state) {
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
