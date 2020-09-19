import { Button, Chip, Container, Tooltip, } from "@material-ui/core";
import { Job, VideoTemplate, Creator } from "services/api";
import ErrorHandler from "components/ErrorHandler";
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
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});
  const [jobIds, setJobIds] = useState([]);
  const { path } = useRouteMatch();
  const tableRef = useRef(null);
  const [darkModeTheme] = useDarkMode();
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
    <Container>
      {error && (
        <ErrorHandler
          message={error.message}
          showRetry={jobIds.length === 0}
          onRetry={handleRetry}
        />
      )}
      <MaterialTable
        tableRef={tableRef}
        title="Your Jobs"
        options={{
          pageSize: 20,
          headerStyle: { fontWeight: 700 },
          actionsColumnIndex: -1,
          selection: true
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
                theme={darkModeTheme === "dark" ? "ocean" : "rjv-default"}
              />
            ),
            icon: "code",
            tooltip: "Show Code",
          },
        ]}
        columns={[
          {
            title: "Video Template",
            field: "videoTemplate.title",
          },
          {
            title: "Version",
            searchable: false,
            render: ({ videoTemplate, idVersion }) => (
              <span>
                {videoTemplate?.versions.find((v) => v?.id === idVersion)
                  ?.title ?? ""}
              </span>
            ),
          },
          {
            title: "Render Time",
            searchable: false,
            render: ({ videoTemplate, idVersion, renderTime }) => (
              <span>
                {renderTime !== -1 ? formatTime(renderTime) : 'NA'}
              </span>
            ),
          },
          {
            searchable: false,
            title: "Last Updated",
            field: "dateUpdated",
            type: "datetime",
            render: ({ dateUpdated }) => (
              <span>{timeago.format(new Date(dateUpdated))}</span>
            ),
            defaultSort: "desc",
          },
          {
            searchable: false,
            title: "State",
            field: "state",
            render: function ({ id, state, failureReason }) {
              state = rtProgressData[id]?.state || state;
              let percent = rtProgressData[id]?.percent;
              console.log(failureReason);
              return (
                <Tooltip
                  TransitionComponent={Fade}
                  title={
                    state === "error"
                      ? failureReason
                        ? failureReason
                        : "Reason not given"
                      : "finished/inProgress"
                  }>
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
                </Tooltip>
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
                return setError(new Error(message));
              }
              setJobIds(jobs.map(({ id }) => id));
              return {
                data: jobs,
                page: query.page,
                totalCount,
              };
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
            onClick: async (e, { id, data, actions }) => {
              try {
                await Job.update(id, { data, actions });
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
