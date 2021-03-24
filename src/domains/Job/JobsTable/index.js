import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

import * as timeago from "timeago.js";

import {
  Chip,
  Typography,
  Container,
  Paper,
  Box,
  Tooltip,
  Fade,
} from "@material-ui/core";
import MaterialTable from "material-table";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Popover from "@material-ui/core/Popover";
import formatTime from "helpers/formatTime";
import Alert from "@material-ui/lab/Alert";
import { useDarkMode } from "helpers/useDarkMode";

import CallMergeIcon from "@material-ui/icons/CallMerge";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import BrandingWatermarkIcon from "@material-ui/icons/BrandingWatermark";

import Filters from "common/Filters";
import ErrorHandler from "common/ErrorHandler";
import { Job, Search } from "services/api";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import UpdateIcon from "@material-ui/icons/Update";

import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import { useAuth } from "services/auth";
import { useSnackbar } from "notistack";
import JSONEditorDialoge from "common/JSONEditorDialoge";
import ActiveJobsTable from "../ActiveJobsTable";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryParam = useQuery();
  const tableRef = useRef(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const filterString = filterObjectToString(filters);
  const handleRetry = () => {
    tableRef.current && tableRef.current.onQueryChange();
    setError(false);
  };

  useEffect(() => {
    handleRetry();
  }, [filterString]);

  useEffect(() => {
    document.title = "Jobs";
  }, []);

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
      filterString,
      orderBy,
      orderDirection
      // idCreator
    )
      .then(({ data = [], count: totalCount }) => {
        // unsubscribeFromProgress()
        // setJobIds(data.map((j) => j.id));
        if (data?.length === 0 && totalCount) {
          history.push(
            `?page=${1}&size=${pageSize}${
              searchQuery ? "searchQuery=" + searchQuery : ""
            }`
          );
          return Job.getAll(
            1,
            pageSize,
            filterString,
            orderBy,
            orderDirection
            // idCreator
          )
            .then(({ data = [], count: totalCount }) => {
              return { data, page: 0, totalCount };
            })
            .catch((err) => {
              setError(err);
              history.push(
                `?page=${1}&size=${pageSize}${
                  searchQuery ? "searchQuery=" + searchQuery : ""
                }`
              );
              return {
                data: [],
                page: 0,
                totalCount: 0,
              };
            });
        }
        return { data, page, totalCount };
      })
      .catch((err) => {
        setError(err);
        history.push(
          `?page=${1}&size=${pageSize}${
            searchQuery ? "searchQuery=" + searchQuery : ""
          }`
        );
        return {
          data: [],
          page: 0,
          totalCount: 0,
        };
      });
  };
  const deleteMultipleJobs = async (array = []) => {
    try {
      await Job.deleteMultiple({
        ids: array.map((a) => a.id),
      });
      enqueueSnackbar(`jobs deleted successfully `, {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(`jobs failed to delete `, {
        variant: "error",
      });
    }
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleJobUpdate = async ({ id, data, actions, renderPrefs }) => {
    try {
      await Job.update(id, { data, actions, renderPrefs }, { noMessage: true });
      enqueueSnackbar(`Job Updated successfully!`, {
        variant: "success",
      });
      setSelectedJob(null);
      tableRef.current && tableRef.current.onQueryChange();
    } catch (err) {
      enqueueSnackbar(
        `Failed to update, ${err?.message ?? "Something went wrong"}`,
        {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        }
      );
    }
  };

  const TimeRenderer = ({ renderTime, id, timeline = [] }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
      <>
        <Typography
          aria-owns={open ? `mouse-over-popover${id}` : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}>
          {renderTime !== -1 ? formatTime(renderTime) : "NA"}
        </Typography>
        <Popover
          id={`mouse-over-popover${id}`}
          open={open}
          style={{ pointerEvents: "none" }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus>
          <Timeline align="alternate">
            {timeline.length ? (
              timeline.map(({ state, startsAt, endsAt }, index) => (
                <TimelineItem>
                  {(index !== 0 && timeline?.length - 1 !== index) && <TimelineOppositeContent>
                    <Typography color="textSecondary">
                      {((endsAt - startsAt) / 1000).toFixed(2)} secs
                    </Typography>
                  </TimelineOppositeContent>}
                  <TimelineSeparator>
                    <TimelineDot
                      style={{
                        backgroundColor:
                          index === 0
                            ? "#ffa117"
                            : index !== timeline?.length - 1
                            ? "#35a0f4"
                            : "#65ba68",
                      }}
                    />
                    {timeline?.length - 1 !== index && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <span>{state}</span>
                  </TimelineContent>
                </TimelineItem>
              ))
            ) : (
              <Typography>Not Available</Typography>
            )}
          </Timeline>
        </Popover>
      </>
    );
  };

  const restartMultiple = async (array) => {
    try {
      const arrIds = array.map((a) => {
        return a.id;
      });
      await Job.updateMultiple({
        ids: arrIds,
        state: "created",
        extra: { forceRerender: true },
      });
      enqueueSnackbar(`jobs restarted successfully `, {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(`jobs failed to restart `, {
        variant: "error",
      });
    }

    tableRef.current && tableRef.current.onQueryChange();
  };

  return (
    <Container>
      {error && (
        <ErrorHandler
          message={error.message}
          showRetry={true}
          onRetry={handleRetry}
        />
      )}
      <Box>
        <ActiveJobsTable onRowClick={(id) => history.push(`${path}${id}`)} />
      </Box>
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
        columns={[
          {
            title: "JobId",
            field: "id",
          },
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
                {videoTemplate?.versions?.find((v) => v?.id === idVersion)
                  ?.title ?? ""}
              </span>
            ),
          },
          {
            title: "Render Time",
            field: "renderTime",
            sorting: false,
            searchable: false,
            render: ({ renderTime, id, timeline }) => (
              <TimeRenderer
                renderTime={renderTime}
                id={id}
                timeline={timeline}
              />
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
            render: ({ state, failureReason }) => {
              return state === "error" ? (
                <Tooltip
                  TransitionComponent={Fade}
                  title={failureReason ? failureReason : "Reason not given"}>
                  <Chip
                    size="small"
                    label={state}
                    style={{
                      fontWeight: 700,
                      background: getColorFromState(state),
                      color: "white",
                      textTransform: "capitalize",
                    }}
                  />
                </Tooltip>
              ) : (
                <Chip
                  size="small"
                  label={state}
                  style={{
                    fontWeight: 700,
                    background: getColorFromState(state),
                    color: "white",
                    textTransform: "capitalize",
                  }}
                />
              );
            },
          },
          {
            searchable: false,
            title: "Current Actions",
            field: "__v",
            type: "numeric",
            render: ({ actions }) => {
              const { postrender, prerender } = actions;
              return (
                <div>
                  {postrender?.map((post) => {
                    if (post?.input2) {
                      return (
                        <CallMergeIcon
                          style={{
                            height: 16,
                            width: 16,
                            color: "grey",
                          }}></CallMergeIcon>
                      );
                    }
                    if (post?.audio) {
                      return (
                        <AudiotrackIcon
                          style={{
                            height: 16,
                            width: 16,
                            color: "grey",
                          }}></AudiotrackIcon>
                      );
                    }
                    if (post?.watermark) {
                      return (
                        <BrandingWatermarkIcon
                          style={{
                            height: 16,
                            width: 16,
                            color: "grey",
                          }}></BrandingWatermarkIcon>
                      );
                    }
                  })}
                </div>
              );
            },
          },
          {
            searchable: false,
            title: "Revisions",
            field: "Revisions",
            render: ({ output }) => <span>{output.length}</span>,
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
            icon: () => <UpdateIcon />,
            tooltip: "Restart Job with priority",
            position: "row",
            onClick: async (e, { id, data, actions, renderPrefs = {} }) => {
              try {
                await Job.update(
                  id,
                  {
                    state: "created",
                    extra: {
                      forceRerender: true,
                    },
                  },
                  { priority: 5 }
                );
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "repeat",
            tooltip: "Restart Job",
            position: "row",
            onClick: async (e, { id, data, actions, renderPrefs = {} }) => {
              try {
                await Job.update(id, {
                  state: "created",
                  extra: {
                    forceRerender: true,
                  },
                });
              } catch (err) {
                setError(err);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "code",
            tooltip: "View/Edit JSON",
            position: "row",
            onClick: async (event, rowData) => {
              setSelectedJob({ ...rowData });
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
              await restartMultiple(data);
            },
          },
          {
            icon: "delete",
            tooltip: "Delete All Selected Jobs",
            position: "toolbarOnSelect",
            onClick: async (e, data) => {
              const action = window.confirm("Are you sure, you want to delete");
              if (!action) return;
              await deleteMultipleJobs(data);
            },
          },
        ]}
      />
      {selectedJob !== null && (
        <JSONEditorDialoge
          json={selectedJob}
          onSubmit={handleJobUpdate}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </Container>
  );
};

const getColorFromState = (state = "", percent) => {
  switch (state.toLowerCase()) {
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
  const { startDate = 0, endDate = 0, idVideoTemplates = [], states = [] } = f;

  return `${
    startDate
      ? `dateUpdated=>=${startDate}&${
          endDate ? `dateUpdated=<=${endDate || startDate}&` : ""
        }`
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
