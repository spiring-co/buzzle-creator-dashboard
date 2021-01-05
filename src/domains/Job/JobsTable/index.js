import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useAuth } from "../../../services/auth";

import io from "socket.io-client";
import * as timeago from "timeago.js";
import ReactJson from "react-json-view";

import {
  Chip,
  Typography,
  Container,
  Paper,
  Tooltip,
  Fade,
} from "@material-ui/core";

import MaterialTable from "material-table";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ErrorHandler from "common/ErrorHandler";

import formatTime from "helpers/formatTime";
import { useDarkMode } from "helpers/useDarkMode";

import { Job, Search } from "services/api";
import Filters from "common/Filters";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const queryParam = useQuery();
  const tableRef = useRef(null);
  const [darkModeTheme] = useDarkMode();
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const { user } = useAuth();
  const idCreator = user.id;

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };

  useEffect(() => {
    handleRetry();
  }, [filters]);

  useEffect(() => {
    document.title = "Jobs";
    console.log(user.id);
  }, []);

  // progress sockets
  const [jobIds, setJobIds] = useState([]);
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});

  function subscribeToProgress(id) {
    if (!socket) return;
    socket.on(id, (data) => {
      // console.log("log", id, data, rtProgressData, { ...rtProgressData, [id]: data })
      setRtProgressData((rtProgressData) => ({
        ...rtProgressData,
        [id]: data,
      }));
    });
  }

  function unsubscribeFromProgress() {
    if (!socket) return;
    jobIds.map(socket.off);
  }

  useEffect(() => {
    setSocket(io.connect(process.env.REACT_APP_EVENTS_SOCKET_URL));
  }, []);

  useEffect(() => {
    if (!socket) {
      return console.log("no socket");
    }
    socket.on("job:add", (data) => console.log("job add data" + data));
  }, [socket]);

  useEffect(() => {
    jobIds.map(subscribeToProgress);

    return () => {
      unsubscribeFromProgress();
    };
  }, [jobIds]);

  const getDataFromQuery = (query) => {
    const {
      page = 0,
      pageSize = 20,
      search: searchQuery = null,
      orderBy: { field: orderBy = "dateUpdated" } = {},
      orderDirection = "asc",
    } = query;

    history.push(
      `?page=${page + 1}&size=${pageSize}${
        searchQuery ? "searchQuery=" + searchQuery : ""
      }`
    );

    // if has search query
    if (searchQuery) {
      return Search.getJobs(
        searchQuery,
        page + 1,
        pageSize
      ).then(({ data, count: totalCount }) => ({ data, page, totalCount }));
    }
    return Job.getAll(
      page + 1,
      pageSize,
      filterObjectToString(filters),
      orderBy,
      orderDirection,
      idCreator
    )
      .then(({ data, count: totalCount }) => {
        console.log(data, totalCount);
        setJobIds(data.map((j) => j.id));
        return { data, page, totalCount };
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        return {
          data: [],
          page: query?.page,
          totalCount: 0,
        };
      });
  };

  return (
    <Container>
      {error && (
        <ErrorHandler
          message={error.message}
          showRetry={jobIds.length === 0}
          onRetry={handleRetry}
        />
      )}
      <Paper style={{ padding: 15, marginBottom: 5 }}>
        <Typography variant="h6">Filters</Typography>
        <Container
          style={{ padding: 5, alignItems: "flex-end", display: "flex" }}>
          <Filters onChange={setFilters} value={filters} />
        </Container>
      </Paper>
      <MaterialTable
        tableRef={tableRef}
        title="Your Jobs"
        options={{
          pageSize: parseInt(queryParam?.get("size")) || 20,
          headerStyle: { fontWeight: 700 },
          actionsColumnIndex: -1,
          selection: true,
          sorting: true,
        }}
        onRowClick={(e, { id }) => {
          // prevents redirection on link click
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
            sorting: false,
            field: "videoTemplate.title",
          },
          {
            title: "Version",
            sorting: false,
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
            field: "renderTime",
            sorting: false,
            searchable: false,
            render: ({ renderTime }) => (
              <span>{renderTime !== -1 ? formatTime(renderTime) : "NA"}</span>
            ),
          },

          {
            searchable: false,
            title: "Last Updated",
            field: "dateUpdated",
            type: "datetime",
            defaultSort: "desc",
            render: ({ dateUpdated }) => (
              <span>{timeago.format(new Date(dateUpdated))}</span>
            ),
          },
          {
            searchable: false,
            title: "Created At",
            field: "dateCreated",
            type: "datetime",
            render: ({ dateCreated }) => (
              <span>{timeago.format(new Date(dateCreated))}</span>
            ),
          },
          {
            searchable: false,
            title: "State",
            field: "state",
            render: ({ id, state, failureReason }) => {
              const newState = rtProgressData[id]?.state ?? state;
              // let percent = rtProgressData[id]?.percent;
              // console.log(rtProgressData, newState, rtProgressData[id]?.state, state)
              return (
                <Tooltip
                  TransitionComponent={Fade}
                  title={
                    newState === "error"
                      ? failureReason
                        ? failureReason
                        : "Reason not given"
                      : "finished/inProgress"
                  }>
                  <Chip
                    size="small"
                    label={`${newState}${
                      rtProgressData[id]?.percent
                        ? " " + rtProgressData[id]?.percent + "%"
                        : ""
                    }`}
                    style={{
                      transition: "background-color 0.5s ease",
                      fontWeight: 700,
                      background: getColorFromState(
                        newState,
                        rtProgressData[id]?.percent
                      ),
                      color: "white",
                    }}
                  />
                </Tooltip>
              );
            },
          },
          {
            searchable: false,
            title: "Revisions",
            field: "__v",
            type: "number",
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: <Typography>No Data to display</Typography>,
          },
        }}
        data={getDataFromQuery}
        actions={[
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: handleRetry,
          },
          {
            icon: () => <FileCopyIcon />,
            tooltip: "Duplicate Job",
            onClick: async (
              e,
              { actions, data, idVideoTemplate, idVersion, renderPrefs }
            ) => {
              try {
                await Job.create({
                  actions,
                  data,
                  idVideoTemplate,
                  idVersion,
                  renderPrefs,
                });
                handleRetry();
              } catch (err) {
                setError(err);
              }
            },
            position: "row",
          },
          {
            icon: "repeat",
            tooltip: "Restart Job",
            position: "row",
            onClick: async (e, { id, data, actions, renderPrefs = {} }) => {
              try {
                await Job.update(id, { data, actions, renderPrefs });
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "delete",
            tooltip: "Delete Job",
            position: "row",
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
          {
            icon: "repeat",
            tooltip: "Restart All Selected Jobs",
            position: "toolbarOnSelect",
            onClick: async (e, data) => {
              try {
                await Job.updateMultiple(
                  data.map(({ id, actions, data, renderPrefs }) => ({
                    id,
                    actions,
                    data,
                    renderPrefs,
                  }))
                );
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "delete",
            tooltip: "Delete All Selected Jobs",
            position: "toolbarOnSelect",
            onClick: async (e, data) => {
              try {
                await Job.deleteMultiple(data);
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
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
    endDate = Date.now(),
    idVideoTemplates = [],
    states = [],
  } = f;

  return `${
    startDate
      ? `dateUpdated=>=${startDate}&dateUpdated=<=${endDate ?? startDate}&`
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
