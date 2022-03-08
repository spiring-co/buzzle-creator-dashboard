import React, { useCallback, useEffect, useRef, useState } from "react";
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
import MaterialTable, { Query } from "material-table";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Popover from "@material-ui/core/Popover";
import formatTime from "helpers/formatTime";
import Alert from "@material-ui/lab/Alert";
import { useDarkMode } from "helpers/useDarkMode";

import VideoLibrary from "@material-ui/icons/VideoLibrary";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import BrandingWatermarkIcon from "@material-ui/icons/BrandingWatermark";

import Filters from "common/Filters";
import AlertHandler from "common/AlertHandler";
import { useAPI } from "services/APIContext";
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
import { Job, JobUpdateParam } from "services/buzzle-sdk/types";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const { state } = useLocation<{ message: string }>()
  const { Job } = useAPI()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryParam = useQuery();
  const tableRef = useRef<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState<any>({});
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const filterString = filterObjectToString(filters);
  const handleRetry = () => {
    tableRef.current && tableRef.current.onQueryChange();
    setError(null);
  };

  useEffect(() => {
    handleRetry();
  }, [filterString]);

  const getDataFromQuery = (query: Query<Job>): any => {
    const {
      page = 0,
      pageSize = 20,
      search: searchQuery = null,
      orderBy: { field: orderBy = "dateUpdated" } = {},
      orderDirection = "asc",
    } = query;
    history.push(
      `?page=${page + 1}&size=${pageSize}${searchQuery ? "searchQuery=" + searchQuery : ""
      }`
      , { ...state });

    // if has search query
    if (searchQuery) {
      return ({ data: [], page: 1, totalCount: 0 });
    }
    return Job.getAll(
      page + 1,
      pageSize,
      filterString || "",
      orderBy,
      orderDirection
      // idCreator
    )
      .then(({ data = [], count: totalCount }) => {
        if (data?.length === 0 && totalCount) {
          history.push(
            `?page=${1}&size=${pageSize}${searchQuery ? "searchQuery=" + searchQuery : ""
            }`
            , {
              ...state
            });
          return Job.getAll(
            1,
            pageSize,
            filterString || "",
            orderBy,
            orderDirection
            // idCreator
          )
            .then(({ data = [], count: totalCount }) => {
              return { data, page: 0, totalCount };
            })
            .catch((err) => {
              setError(err as Error);
              history.push(
                `?page=${1}&size=${pageSize}${searchQuery ? "searchQuery=" + searchQuery : ""
                }`
                , { ...state });
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
        setError(err as Error);
        history.push(
          `?page=${1}&size=${pageSize}${searchQuery ? "searchQuery=" + searchQuery : ""
          }`
          , { ...state });
        return {
          data: [],
          page: 0,
          totalCount: 0,
        };
      });
  }
  const deleteMultipleJobs = async (array: any) => {
    try {
      await Job.deleteMultiple({
        ids: array.map((a: any) => a?.id as string),
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

  const handleJobUpdate = async ({ id, data, actions, renderPrefs }: JobUpdateParam & { id: string }) => {
    try {
      await Job.update(id, { data, actions, renderPrefs }, { noMessage: true });
      enqueueSnackbar(`Job Updated successfully!`, {
        variant: "success",
      });
      setSelectedJob(null);
      tableRef.current && tableRef.current.onQueryChange();
    } catch (err) {
      enqueueSnackbar(
        `Failed to update, ${(err as Error)?.message ?? "Something went wrong"}`,
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

  const TimeRenderer = ({ renderTime, id, timeline = [] }: any) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event: any) => {
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
              timeline.map(({ state, startsAt, endsAt }: any, index: number) => (
                <TimelineItem>
                  {index !== 0 && timeline?.length - 1 !== index && (
                    <TimelineOppositeContent>
                      <Typography color="textSecondary">
                        {((endsAt - startsAt) / 1000).toFixed(2)} secs
                      </Typography>
                    </TimelineOppositeContent>
                  )}
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

  const restartMultiple = async (array: any) => {
    try {
      const arrIds = array.map((a: any) => {
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
    <div>
      {error && (
        <AlertHandler
          message={error.message}
          showRetry={true}
          onRetry={handleRetry}
        />
      )}
      {state?.message ? <AlertHandler severity="info" message={state?.message ?? ""} /> : <div />}
      <Box>
        <ActiveJobsTable onRowClick={(id: string) => history.push(`${path}${id}`)} />
      </Box>
      <Paper style={{ padding: 15, marginBottom: 5 }}>
        <Typography variant="h6">Filters</Typography>
        <Container
          style={{ padding: 5, alignItems: "flex-end", display: "flex" }}>
          <Filters
            //@ts-ignore
            onChange={(v: any) => setFilters(v)}
            value={filters} />
        </Container>
      </Paper>
      <MaterialTable
        tableRef={tableRef}
        title="Your Jobs"
        options={{
          pageSize: parseInt(queryParam?.get("size") + "") || 20,
          headerStyle: { fontWeight: 700 },
          actionsColumnIndex: -1,
          selection: true,
          // padding: 'dense',
          sorting: true,
        }}
        onRowClick={(e: any, { id }: any) => {
          // prevents redirection on link click
          if (["td", "TD"].includes(e.target.tagName))
            window.open(`${path}${id}`);
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
            render: ({ videoTemplate, idVersion }: any) => (
              <span>
                {videoTemplate?.versions?.find((v: any) => v?.id === idVersion)
                  ?.title ?? ""}
              </span>
            ),
          },
          {
            title: "Render Time",
            field: "renderTime",
            sorting: false,
            searchable: false,
            render: ({ renderTime, id, timeline }: any) => (
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
            render: ({ dateUpdated }: any) => (
              <span>{timeago.format(new Date(dateUpdated))}</span>
            ),
          },
          {
            searchable: false,
            title: "Created At",
            field: "dateCreated",
            type: "datetime",
            render: ({ dateCreated }: any) => (
              <span>{timeago.format(new Date(dateCreated))}</span>
            ),
          },
          {
            searchable: false,
            title: "source",
            render: ({ sourceCreatedBy = "" }: any) => {
              return <Tooltip
                TransitionComponent={Fade}
                title={(sourceCreatedBy || "api") === "api" ? "Created using API" : "Created from buzzle"}>
                <Chip
                  size="small"
                  label={sourceCreatedBy || "api"}
                  style={{
                    fontWeight: 700,
                    background: getColorFromSource(sourceCreatedBy || "api"),
                    color: "white",
                    textTransform: "uppercase",
                  }}
                />
              </Tooltip>
            }
          },
          {
            searchable: false,
            title: "State",
            field: "state",
            render: ({ state, failureReason }: any) => {
              return state === "error" ? (
                <Tooltip
                  TransitionComponent={Fade}
                  title={failureReason ? failureReason : "Reason not given"}>
                  <Chip
                    size="small"
                    label={state}
                    style={{
                      fontWeight: 700,
                      background: getColorFromState(state as any),
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
                    background: getColorFromState(state as any),
                    color: "white",
                    textTransform: "capitalize",
                  }}
                />
              );
            },
          },
          {
            searchable: false,
            title: "Render Actions",
            render: ({ actions }: any) => {
              const { postrender = [], prerender = [] } = actions;
              return (
                <div>
                  {postrender?.map(({ module }: any) => {
                    if (module === "buzzle-action-merge-videos") {
                      return (
                        <Tooltip title="Merge Video">
                          <VideoLibrary color="disabled" />
                        </Tooltip>
                      );
                    } else if (module === "buzzle-action-add-audio") {
                      return (
                        <Tooltip title="Add Audio">
                          <AudiotrackIcon color="disabled" />
                        </Tooltip>
                      );
                    } else if (module === "buzzle-action-watermark") {
                      return (
                        <Tooltip title="Watermark action">
                          <BrandingWatermarkIcon color="disabled" />
                        </Tooltip>
                      );
                    } else return <div />;
                  })}
                </div>
              );
            },
          },
          {
            searchable: false,
            title: "Outputs",
            render: ({ output = [] }: any) => <span>{output.length}</span>,
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
              e: any,
              { actions, data, idVideoTemplate, idVersion, renderPrefs }: any
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
                setError(err as Error);
              }
            },
            position: "row",
          },
          {
            icon: () => <UpdateIcon />,
            tooltip: "Restart Job with priority",
            position: "row",
            onClick: async (e, { id, data, actions, renderPrefs = {} }: any) => {
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
                setError(err as Error);
              }
              tableRef.current && tableRef.current.onQueryChange();
            },
          },
          {
            icon: "repeat",
            tooltip: "Restart Job",
            position: "row",
            onClick: async (e, { id, data, actions, renderPrefs = {} }: any) => {
              try {
                await Job.update(id, {
                  state: "created",
                  extra: {
                    forceRerender: true,
                  },
                });
              } catch (err) {
                setError(err as Error);
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
            onClick: async (event: any, rowData: any) => {
              const action = window.confirm("Are you sure, you want to delete");
              if (!action) return;
              try {
                await Job.delete(rowData.id);
                tableRef.current && tableRef.current.onQueryChange();
              } catch (err) {
                setError(err as Error);
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
    </div>
  );
};
const getColorFromSource = (source: string) => {
  switch (source) {
    case "api":
      return "#ffa502"
    default:
      return "#3742fa"
  }
}
const getColorFromState = (state = "", percent?: number) => {
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

const getArrayOfIdsAsQueryString = (field: string, ids: Array<string>) => {
  return ids
    .map((id, index) => `${index === 0 ? "" : "&"}${field}[]=${id}`)
    .toString()
    .replace(/,/g, "");
};
const filterObjectToString = (f: any) => {
  if (!f) return null;
  const { startDate = 0, endDate = 0, idVideoTemplates = [], states = [] } = f;

  return `${startDate
    ? `dateUpdated=>=${startDate}&${endDate ? `dateUpdated=<=${endDate || startDate}&` : ""
    }`
    : ""
    }${idVideoTemplates.length !== 0
      ? getArrayOfIdsAsQueryString(
        "idVideoTemplate",
        idVideoTemplates.map(({ id }: { id: string }) => id)
      ) + "&"
      : ""
    }${states.length !== 0 ? getArrayOfIdsAsQueryString("state", states) : ""}`;
};
