import React, { useState, useRef, useEffect } from "react";
import { Chip, Link, Button, Container } from "@material-ui/core";
import MaterialTable from "material-table";
import {
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom";
import ErrorHandler from "components/ErrorHandler";
import { useAuth } from "services/auth";

import { Job } from "services/api";
import ReactJson from "react-json-view";
import io from "socket.io-client";
import * as timeago from "timeago.js";

export default () => {
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});
  const [jobIds, setJobIds] = useState([]);
  const { path } = useRouteMatch();
  const tableRef = useRef(null);

  const { user } = useAuth();
  const history = useHistory();

  const uri = `${process.env.REACT_APP_API_URL}/creators/${user?.id}/jobs`;

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };

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
    setSocket(io.connect(process.env.REACT_APP_EVENTS_SOCKET_URL));
  }, []);

  useEffect(() => {
    jobIds.map(subscribeToProgress);

    return () => {
      unsubscribeFromProgress();
    };
  }, [jobIds]);

  return (
    <Container fluid>
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
          actionsColumnIndex: -1,
        }}
        onRowClick={(e, { id }) => {
          if (["td", "TD"].includes(e.target.tagName))
            history.push(`${path}${id}`);
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
          // {
          //   title: "Job Id",
          //   field: "id",
          //   render: ({ id, state }) => {
          //     state = rtProgressData[id]?.state || state;

          //     if (state !== "finished") return <span>{id}</span>;
          //     return (
          //       <Link component={RouterLink} to={`${path}${id}`}>
          //         {id}
          //       </Link>
          //     );
          //   },
          // },
          {
            title: "Video Template",
            render: ({ videoTemplate }) => (
              <span>
                <Link
                  component={RouterLink}
                  to={`/home/videoTemplates/${videoTemplate?.id}`}>
                  {videoTemplate?.title}
                </Link>
              </span>
            ),
          },
          {
            title: "Version",
            render: ({ videoTemplate, idVersion }) => (
              <span>
                {videoTemplate?.versions.find((v) => v?.id === idVersion)
                  ?.title ?? ""}
              </span>
            ),
          },
          {
            title: "Last Updated",
            field: "dateUpdated",
            type: "datetime",
            render: ({ dateUpdated }) => (
              <span>{timeago.format(new Date(dateUpdated))}</span>
            ),
            defaultSort: "desc",
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
          // TODO should be abstracted to API service
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
            onClick: async (e, { id, data }) => {
              try {
                await Job.update(id, { data });
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "delete",
            tooltip: "Delete Job",
            onClick: async (event, rowData) => {
              const action = window.confirm("Are you sure, you want to delete");
              if (!action) return;
              try {
                await Job.delete(rowData.id);
                tableRef.current && tableRef.current.onQueryChange();
              } catch (err) {
                setError(err);
              }
            },
          },
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
      return "#ffa502";
    case "rendering":
      return `linear-gradient(90deg, #4caf50 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};
