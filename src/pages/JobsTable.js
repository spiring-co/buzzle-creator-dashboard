import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

import io from "socket.io-client";
import * as timeago from "timeago.js";
import ReactJson from "react-json-view";

import {
  Button,
  Chip,
  Container,
  Tooltip,
  Fade,
} from "@material-ui/core";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import MaterialTable, { MTableToolbar } from "material-table";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ErrorHandler from "components/ErrorHandler";

import formatTime from "helpers/formatTime";
import { useDarkMode } from "helpers/useDarkMode";

import { useAuth } from "services/auth";
import { Job, Search, Creator } from "services/api";
import Filters from "components/Filters";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default props => {
  const { path } = useRouteMatch();
  const { user } = useAuth();
  const history = useHistory();
  let queryParam = useQuery();
  const tableRef = useRef(null)
  const [darkModeTheme] = useDarkMode();
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };

  useEffect(() => {
    handleRetry();
  }, [filters]);

  // progress sockets

  const [jobIds, setJobIds] = useState([]);
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});

  function subscribeToProgress(id) {
    if (!socket) return;
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
          pageSize: parseInt(queryParam?.get('size')),
          headerStyle: { fontWeight: 700 },
          actionsColumnIndex: -1,
          selection: true,
        }}
        components={{
          Toolbar: (props) => {
            return (
              <div>
                <MTableToolbar {...props} />
                <div
                  style={{
                    marginLeft: 25,
                    marginTop: 10,
                    display: "flex",
                    alignItems: "baseline",
                  }}>
                  <Filters
                    onChange={(f) => {
                      console.log(f);
                      setFilters(f);
                    }}
                    value={filters}
                  />
                </div>
              </div>
            );
          },
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
            render: ({ renderTime }) => (
              <span>{renderTime !== -1 ? formatTime(renderTime) : "NA"}</span>
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
        data={(query) => {
          console.log(query)
          history.push(`?page=${query?.page ? query?.page + 1 : queryParam?.get('page') ?? 1}&size=${query?.pageSize ? query?.pageSize : queryParam?.get('size') ?? 20}`)
          return (query?.search ? Search.getJobs(query?.search, query?.page ? query?.page + 1 : queryParam?.get('page') ?? 1, query?.pageSize ? query?.pageSize : queryParam?.get('size') ?? 20).then(
            ({ data, count: totalCount }) => ({
              data,
              page: query?.page,
              totalCount,
            })
          )
            : Job.getAll(query?.page ? query?.page + 1 : queryParam?.get('page') ?? 1, query?.pageSize ? query?.pageSize : queryParam?.get('size') ?? 20, `${filters?.startDate
              ? `dateUpdated=>=${filters?.startDate}&dateUpdated=<=${filters?.endDate
              ?? filters?.startDate}`
              : ''}${filters?.idVideoTemplate
                ? `&idVideoTemplate=${filters?.idVideoTemplate}`
                : ""}${filters?.state
                  ? `&state=${filters?.state}`
                  : undefined}`)
              .then((result) => {
                setJobIds(result.data.map((j) => j.id));
                return {
                  data: result.data,
                  page: query?.page,
                  totalCount: result.count,
                };
              })
              .catch((err) => {
                setError(err);
                return {
                  data: [],
                  page: query?.page,
                  totalCount: 0,
                };
              }))
        }}
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
            onClick: async (e, { actions,
              data,
              idVideoTemplate,
              idVersion,
              renderPrefs, }) => {
              try {
                await Job.create({
                  actions,
                  data,
                  idVideoTemplate,
                  idVersion,
                  renderPrefs,
                })
                handleRetry()
              }
              catch (err) {
                setError(err)
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
                await Job.updateMultiple(data.map(({ id, actions, data, renderPrefs }) => ({ id, actions, data, renderPrefs })));
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
      return `linear-gradient(90deg, #4caf50 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};

const serialize = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};
