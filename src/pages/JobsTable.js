import {
  Button, Chip, Container, Tooltip, FormControl
  , InputLabel, FormHelperText, MenuItem, Select, TextField
} from "@material-ui/core";
import { Job, VideoTemplate, Creator, Search } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import { useDarkMode } from "helpers/useDarkMode";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useAuth } from "services/auth";
import io from "socket.io-client";
import Fade from '@material-ui/core/Fade';
import formatTime from "helpers/formatTime";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import * as timeago from "timeago.js";


export default () => {
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [rtProgressData, setRtProgressData] = useState({});
  const [jobIds, setJobIds] = useState([]);
  const { path } = useRouteMatch();
  const [isFilterEnabled, setIsFilterEnabled] = useState(false)
  const tableRef = useRef(null);
  const [darkModeTheme] = useDarkMode();
  const { user } = useAuth();
  const history = useHistory();
  const [filters, setFilters] = useState({

    idVideoTemplate: "",
    state: ""
  })
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
          selection: true,
        }}
        components={{
          Toolbar: props => {
            console.log(props)
            return (
              <div >
                <MTableToolbar {...props} />
                <div style={{ marginLeft: 25, marginTop: 10, display: 'flex', alignItems: 'baseline' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      style={{ width: 150, marginBottom: 0 }}
                      disableToolbar
                      margin="dense"
                      format="MM/dd/yyyy"
                      id="date-picker-inline"
                      label="Start date"
                      value={filters?.startDate ?? null}
                      onChange={v => setFilters({ ...filters, startDate: new Date(v).toISOString() })}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                    <KeyboardDatePicker
                      margin="dense"
                      style={{ marginLeft: 10, width: 150, marginRight: 10, marginBottom: 0 }}
                      disableToolbar
                      format="MM/dd/yyyy"
                      id="date-picker-inline"
                      label="End date"
                      value={filters?.endDate ?? null}
                      onChange={v => setFilters({ ...filters, endDate: new Date(v).toISOString() })}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <TextField style={{ marginRight: 10, width: 150 }} placeholder="Template Id" margin="dense" defaultValue={filters?.idVideoTemplate}
                    onBlur={({ target: { value } }) => setFilters({ ...filters, idVideoTemplate: value })}
                  />
                  <FormControl style={{ marginRight: 10, width: 100, }}>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters?.state}
                      onChange={({ target: { value } }) => setFilters({ ...filters, state: value })}
                    >
                      <MenuItem value={""}>All</MenuItem>
                      <MenuItem value={'error'}>Error</MenuItem>
                      <MenuItem value={'created'}>Created</MenuItem>
                      <MenuItem value={'finished'}>Finished</MenuItem>
                    </Select>
                  </FormControl>
                  <Button children="filter" size="small" variant="contained" color="primary" onClick={() => {
                    setIsFilterEnabled(true)
                    handleRetry()
                  }} />
                  {isFilterEnabled && <Button disabled={!isFilterEnabled} children="clear filter" size="small" color="primary" onClick={() => {
                    setIsFilterEnabled(false)
                    setFilters({
                      state: "", idVideoTemplate: ""
                    })
                    handleRetry()
                  }} />}
                </div>

              </div>
            )
          }
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
          query?.search
            ? Search.get(query?.search, query.page + 1, query.pageSize).then(({ jobs }) => ({
              data: jobs,
              page: query?.page,
              totalCount: jobs.length
            }))
            : (user?.role === 'Admin'
              //passs filters here if isFiltering is true
              ? Job.getAll(query.page + 1, query.pageSize, [], isFilterEnabled ? filters : {})
                .then((result) => {
                  return {
                    data: result.data,
                    page: query.page,
                    totalCount: result.count,
                  };
                })
                .catch((err) => {
                  setError(err);
                  return {
                    data: [],
                    page: query.page,
                    totalCount: 0,
                  };
                })
              :
              //passs filters here if isFiltering is true
              Creator.getJobs(user?.id, query.page + 1, query.pageSize, isFilterEnabled ? filters : {})
                .then((result) => {
                  //change on final deploy to .jobs to .data as per convention
                  return {
                    data: result.jobs,
                    page: query.page,
                    totalCount: result.count,
                  };
                })
                .catch((err) => {
                  setError(err);
                  return {
                    data: [],
                    page: query.page,
                    totalCount: 0,
                  };
                }))
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
            position: 'row',
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
            position: 'row',
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
            position: 'toolbarOnSelect',
            onClick: async (e, data) => {
              try {
                await Job.updateMultiple(data);
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "delete",
            tooltip: "Delete All Selected Jobs",
            position: 'toolbarOnSelect',
            onClick: async (e, data) => {
              try {
                await Job.deleteMultiple(data);
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
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
      return "#ffa502";
    case "rendering":
      return `linear-gradient(90deg, #4caf50 ${percent}%, grey ${percent}%)`;
    default:
      return "grey";
  }
};
