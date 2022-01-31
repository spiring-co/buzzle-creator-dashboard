import React, { useRef, useState } from "react";
import {
  Link as RouterLink,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

// libs
import * as timeago from "timeago.js";
import MaterialTable from "material-table";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";

// icons
import PublishIcon from "@material-ui/icons/Publish";
import FileCopyIcon from "@material-ui/icons/FileCopy";

// components
import SnackAlert from "common/SnackAlert";

import { SnackbarProvider, useSnackbar } from "notistack";
// services
import { useAuth } from "services/auth";
import { Search, VideoTemplate } from "services/api";
import JSONEditorDialoge from "common/JSONEditorDialoge";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default (props) => {
  const history = useHistory();
  let queryParam = useQuery();
  let { url, path } = useRouteMatch();

  // state variables
  const [error, setError] = useState(null);
  const [selectedVideoTemplate, setSelectedVideoTemplate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { user } = useAuth();
  const { role } = user;

  const tableRef = useRef(null);

  const handleDelete = async (id) => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      await VideoTemplate.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      tableRef.current && tableRef.current.onQueryChange();
      setIsDeleting(false);
    }
  };

  const [deleteStatus, setDeleteStatus] = useState(
    props?.location?.state?.statusObj ?? { status: false, err: false }
  );

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };
  const handleDuplicate = async (data) => {
    let key = null
    try {
      key = enqueueSnackbar("Creating...", {
        persist: true,
      })
      delete data['tableData']
      delete data['id']
      delete data['idCreator']
      delete data['dateCreated']
      delete data['dateUpdated']
      await VideoTemplate.create(data);
      closeSnackbar(key)
      enqueueSnackbar(`Duplicated successfully`, {
        variant: "success",
      });
      window.location.reload()//TODO Replace with data refresh
    } catch (err) {
      if (key) {
        closeSnackbar(key)
      }
      enqueueSnackbar(`Failed to duplicate, ${err?.message}`, {
        variant: "error",
      });
    }
  }
  let { status, err } = deleteStatus;

  const getDataFromQuery = (query) => {
    const {
      page = 0,
      pageSize = 50,
      search: searchQuery = null,
      orderBy: { field: orderBy = "dateUpdated" } = {},
      orderDirection = "desc",
    } = query;
    history.push(
      `?page=${page + 1}&size=${pageSize}${searchQuery ? "searchQuery=" + searchQuery : ""
      }`
    );

    // if has search query
    if (searchQuery) {
      return Search.getVideoTemplates(
        searchQuery,
        page + 1,
        pageSize
      ).then(({ data, count: totalCount }) => ({ data, page, totalCount }));
    }

    return VideoTemplate.getAll(
      page + 1,
      pageSize,
      "",
      orderBy,
      orderDirection ? orderDirection : "desc",
    )
      .then(({ data, count: totalCount }) => {
        console.log(data);
        return { data, page, totalCount };
      })
      .catch((err) => {
        setError(err);
        return {
          data: [],
          page: query?.page,
          totalCount: 0,
        };
      });
  };
  const handleVideoTemplateUpdate = async (data) => {
    try {
      await VideoTemplate.update(data?.id, { ...data });
      enqueueSnackbar(`Job Updated successfully!`, {
        variant: "success",

      });
      setSelectedVideoTemplate(null);
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

  return (
    <Container>
      <SnackAlert
        open={err || status}
        type={status ? "success" : "error"}
        message={
          status
            ? status?.message ?? "Deleted Successfully"
            : err?.message ?? "Oops, something went wrong, action failed !"
        }
        onClose={() => setDeleteStatus({ status: false, err: false })}
      />
      <Paper style={{ marginBottom: 25, padding: 15 }}>
        <Button
          color="primary"
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => history.push(`${url}/ae/add`)}>
          Add After Effects Template
        </Button>
        <Button
          color="primary"
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => history.push(`${url}/remotion/add`)}>
          Add Remotion Template
        </Button>
        <Button
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => {
            history.push(`${url}/drafts`);
          }}>
          Drafted Templates
        </Button>
      </Paper>

      <MaterialTable
        tableRef={tableRef}
        title="Video Templates"
        onRowClick={(e, { id }) => {
          history.push(`${path}${id}`);
        }}
        columns={[
          {
            title: "Title",
            field: "title",
            render: ({ title, thumbnail }) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Avatar
                  style={{ marginRight: 10, height: 30, width: 30 }}
                  alt="thumbnail"
                  src={thumbnail}
                />
                {title}
              </div>
            ),
          },
          {
            title: "Versions",
            render: ({ versions }) => <span>{versions.length}</span>,
          },
          {
            title: "Orientation",
            render: ({ orientation }) => <span>{orientation}</span>,
          },
          {
            title: "Publish State",
            field: "publishState",
            render: function ({
              publishState = "unpublished",
              rejectionReason = null,
            }) {
              return (
                <Tooltip
                  TransitionComponent={Fade}
                  title={rejectionReason ? publishState : rejectionReason}>
                  <Chip
                    size="small"
                    label={publishState}
                    style={{
                      background: getColorFromState(publishState),
                      color: "white",
                    }}
                  />
                </Tooltip>
              );
            },
          },
          {
            title: "Last Updated",
            field: "dateUpdated",
            type: "datetime",
            render: ({ dateUpdated }) => (
              <span>{timeago.format(dateUpdated)}</span>
            ),
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: error ? (
              <Box>
                <Typography>{error.message}</Typography>
                <Button
                  onClick={handleRetry}
                  color="secondary"
                  variant="outlined"
                  children={"Retry"}
                />
              </Box>
            ) : (
              <Typography>
                <Link component={RouterLink} to={`${path}add`}>
                  Click here
                </Link>{" "}
                to create a Video Template😀
              </Typography>
            ),
          },
        }}
        actions={
          role === "Admin"
            ? [
              {
                icon: "code",
                tooltip: "View/Edit JSON",
                position: "row",
                onClick: async (event, rowData) => {
                  setSelectedVideoTemplate(rowData);
                },
              },
            ]
            : [
              {
                icon: "code",
                tooltip: "View/Edit JSON",
                position: "row",
                onClick: async (event, rowData) => {
                  setSelectedVideoTemplate(rowData);
                },
              },
              {
                icon: () => <FileCopyIcon />,
                tooltip: "Duplicate",
                position: "row",
                onClick: async (event, rowData) => {
                  handleDuplicate(rowData);
                },
              },
              {
                icon: () => <PublishIcon />,
                tooltip: `Publish your template`,
                onClick: (e, data) => {
                  history.push({
                    pathname: `${url}/${data.id}/publish`,
                    state: {
                      videoTemplate: data,
                    },
                  });
                },
              },

              {
                icon: "alarm-on",
                tooltip: "Render Test Job",
                onClick: (e, item) => {
                  // setTestJobTemplate(item);
                  history.push({
                    pathname: "/testJob",
                    state: {
                      videoTemplate: item,
                      versions: item.versions,
                    },
                  });
                },
              },
              {
                icon: "delete",
                tooltip: "Delete Template",
                disabled: isDeleting,
                onClick: async (event, { id }) => handleDelete(id),
              },
              // {
              //   icon: "add",
              //   tooltip: "Add Video Template",
              //   isFreeAction: true,
              //   onClick: () => history.push(`${url}/add`),
              // },

              {
                icon: "edit",
                tooltip: "Edit Template",
                onClick: (e, data) => {
                  delete data["tableData"];
                  history.push({
                    pathname: `${url}/${data.id}/edit`,
                    state: {
                      isEdit: true,
                      video: data,
                    },
                  });
                },
              },
              // {
              //   icon: "sort",
              //   tooltip: "Drafted Templates",
              //   isFreeAction: true,
              //   style: { backgroundColor: "blue" },
              //   onClick: () => {
              //     history.push(`${url}/drafts`);
              //   },
              // },
              {
                icon: "refresh",
                tooltip: "Refresh Data",
                isFreeAction: true,
                onClick: handleRetry,
              },
            ]
        }
        data={getDataFromQuery}
        options={{
          sorting: false,
          pageSize: parseInt(queryParam?.get("size")) || 30,
          headerStyle: { fontWeight: 700 },
          minBodyHeight: 500,
          actionsColumnIndex: -1,
        }}
      />
      {selectedVideoTemplate !== null && (
        <JSONEditorDialoge
          json={selectedVideoTemplate}
          onSubmit={handleVideoTemplateUpdate}
          onClose={() => setSelectedVideoTemplate(null)}
        />
      )}
    </Container>
  );
};

const getColorFromState = (state) => {
  switch (state) {
    case "rejected":
      return "#f44336";
    case "pending":
      return "#ffa502";
    case "published":
      return `#4caf50`;
    default:
      return "grey";
  }
};
