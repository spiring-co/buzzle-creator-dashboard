import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Chip,
  Tooltip,
  Container,
  GridList,
  GridListTile,
  GridListTileBar,
  Fade,
  IconButton,
  Link,
  Avatar,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GridOnIcon from "@material-ui/icons/GridOn";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import ListIcon from "@material-ui/icons/List";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Job, VideoTemplate, Creator, Search } from "services/api";
import PublishIcon from "@material-ui/icons/Publish";
import ErrorHandler from "common/ErrorHandler";
import SnackAlert from "common/SnackAlert";
import TestJobDialog from "common/TestJobDialog";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import {
  Link as RouterLink,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useAuth } from "services/auth";
import * as timeago from "timeago.js";
import RoleBasedView from "common/RoleBasedView";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default (props) => {
  let { url, path } = useRouteMatch();
  let queryParam = useQuery();

  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sort, setSort] = useState("dateUpdated");
  const [order, setOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [testJobTemplate, setTestJobTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [view, setView] = useState("list");
  const tableRef = useRef(null);
  const { user } = useAuth();
  const { role } = user;
  const handleDelete = async (id) => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      console.log("delete ", id);
      await VideoTemplate.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      tableRef.current && tableRef.current.onQueryChange();
      setIsDeleting(false);
    }
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 850,
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
    drafted: {
      marginLeft: 10,
    },
  }));
  const classes = useStyles();

  const [deleteStatus, setDeleteStatus] = useState(
    props?.location?.state?.statusObj ?? { status: false, err: false }
  );
  // useEffect(() => {
  //   const data = async () => {
  //     setData(await Creator.getVideoTemplates(user?.id, 1, 10));
  //   };
  //   data();
  // }, []);

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };

  useEffect(() => {
    document.title = "Video Templates";
  }, []);

  let { status, err } = deleteStatus;
  useEffect(() => {
    handleRetry();
  }, [sort, order]);

  const getDataFromQuery = (query) => {
    const {
      page = 0,
      pageSize = 50,
      search: searchQuery = null,
      orderBy: { field: orderBy = "dateUpdated" } = {},
      orderDirection = "asc",
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

    return VideoTemplate.getAll(page + 1, pageSize, "", orderBy, orderDirection)
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
      {error && (
        <ErrorHandler
          message={error.message}
          showRetry={true}
          onRetry={handleRetry}
        />
      )}
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
      <Box
        display="flex"
        alignItems="end"
        justifyContent="space-between"
        flexDirection="row"
        p={1}>
        <div>
          <FormControl style={{ marginRight: 10, width: 150 }}>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              onChange={({ target: { value } }) => setSort(value)}>
              <MenuItem value={"dateUpdated"}>Date Updated</MenuItem>
              <MenuItem value={"dateCreated"}>Date Created</MenuItem>
              <MenuItem value={"publishState"}>Publish State</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ marginRight: 10, width: 150 }}>
            <InputLabel id="demo-simple-select-label">Order By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order}
              onChange={({ target: { value } }) => setOrder(value)}>
              <MenuItem value={"desc"}>Descending</MenuItem>
              <MenuItem value={"asc"}>Ascending</MenuItem>
            </Select>
          </FormControl>
        </div>
        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={(e, v) => setView(v)}
          aria-label="text alignment">
          <Tooltip title="Grid view">
            <ToggleButton value="grid" aria-label="list">
              <GridOnIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="List view">
            <ToggleButton value="list" aria-label="grid">
              <ListIcon />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
      {view === "grid" ? (
        <Box className={classes.root}>
          <GridList cellHeight={250} className={classes.gridList}>
            {data.map((tile) => (
              <GridListTile key={tile.thumbnail}>
                <img src={tile.thumbnail} alt={tile.title} />
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>by: {tile.idCreator}</span>}
                  actionIcon={
                    <Tooltip title="View details">
                      <IconButton
                        onClick={() => {
                          history.push(`${path}${tile.id}`);
                        }}
                        aria-label={`info about ${tile.title}`}
                        className={classes.icon}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </Box>
      ) : (
        <MaterialTable
          tableRef={tableRef}
          title="Your Video Templates"
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
                  />{" "}
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
                <Button
                  onClick={handleRetry}
                  color="secondary"
                  variant="outlined"
                  children={"Retry"}
                />
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
                    render: () => <RoleBasedView></RoleBasedView>,
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
                    render: () => <RoleBasedView></RoleBasedView>,
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
            pageSize: parseInt(queryParam?.get("size")) || 20,
            headerStyle: { fontWeight: 700 },
            minBodyHeight: 500,
            actionsColumnIndex: -1,
          }}
        />
      )}

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
