import React, { useRef, useState } from "react";
import {
  Link as RouterLink,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

// libs
import * as timeago from "timeago.js";
import ReactJson from "react-json-view";
import MaterialTable from "material-table";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";

// icons
import PublishIcon from "@material-ui/icons/Publish";

// components
import SnackAlert from "common/SnackAlert";
import TestJobDialog from "../CreateTestJobDialog";

// services
import { useAuth } from "services/auth";
import { Search, VideoTemplate } from "services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default (props) => {
  const history = useHistory();
  let queryParam = useQuery();
  let { url, path } = useRouteMatch();

  // state variables
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testJobTemplate, setTestJobTemplate] = useState(null);

  const { user } = useAuth();
  const idCreator = user.id;
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

  let { status, err } = deleteStatus;

  const getDataFromQuery = (query) => {
    const {
      page = 0,
      pageSize = 50,
      search: searchQuery = null,
      orderBy: { field: orderBy = "dateUpdated" } = {},
      orderDirection = "desc",
    } = query;
    console.log(query);
    history.push(
      `?page=${page + 1}&size=${pageSize}${
        searchQuery ? "searchQuery=" + searchQuery : ""
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
      idCreator
    )
      .then(({ data, count: totalCount }) => {
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
        actions={
          role === "Admin"
            ? []
            : [
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
                    setTestJobTemplate(item);
                    setIsDialogOpen(true);
                  },
                },
                {
                  icon: "delete",
                  tooltip: "Delete Template",
                  disabled: isDeleting,
                  onClick: async (event, { id }) => handleDelete(id),
                },
                {
                  icon: "add",
                  tooltip: "Add Video Template",
                  isFreeAction: true,
                  onClick: () => history.push(`${url}/add`),
                },

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
                {
                  icon: "sort",
                  tooltip: "Drafted Templates",
                  isFreeAction: true,
                  style: { backgroundColor: "blue" },
                  onClick: () => {
                    history.push(`${url}/drafts`);
                  },
                },
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

      <TestJobDialog
        open={isDialogOpen}
        idVideoTemplate={testJobTemplate?.id ?? ""}
        onClose={() => setIsDialogOpen(false)}
        versions={testJobTemplate?.versions ?? []}
      />
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
