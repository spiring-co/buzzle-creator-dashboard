import {
  Box, Chip, Tooltip,
  Container,
  GridList,
  GridListTile,
  GridListTileBar, Fade,
  IconButton,
  Link,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GridOnIcon from "@material-ui/icons/GridOn";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import ListIcon from "@material-ui/icons/List";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { apiClient } from "buzzle-sdk";
import PublishIcon from '@material-ui/icons/Publish';
import ErrorHandler from "components/ErrorHandler";
import SnackAlert from "components/SnackAlert";
import TestJobDialog from "components/TestJobDialog";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useAuth } from "services/auth";
import * as timeago from "timeago.js";
const { VideoTemplate } = apiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  authToken: localStorage.getItem("jwtoken"),
});

export default (props) => {
  let { url, path } = useRouteMatch();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [testJobTemplate, setTestJobTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [view, setView] = useState("list");
  const tableRef = useRef(null);
  const { user } = useAuth();
  const role = 'creator'//'admin'
  const uri = `${process.env.REACT_APP_API_URL}/creators/${user?.id}/videoTemplates`;
  const handleDelete = async (id) => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      console.log("delete ", id)
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
      marginLeft: 10
    }
  }));
  const classes = useStyles();

  const [deleteStatus, setDeleteStatus] = useState(
    props?.location?.state?.statusObj ?? { status: false, err: false }
  );
  useEffect(() => {
    const data = async () => {
      const response = await fetch(`${uri}?page=${1}&size=${10}`);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setData(result.data);
      }
    };
    data();
  }, []);

  const handleRetry = () => {
    setError(false);
    tableRef.current && tableRef.current.onQueryChange();
  };
  let { status, err } = deleteStatus;

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
        {role !== 'admin' && <Box><Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => history.push(`${url}/add`)}
          children="Add Template"
          startIcon={<AddIcon />}
        />
          <Button
            color="primary"
            variant="contained"
            className={classes.drafted}
            onClick={() => history.push(`${url}/drafts`)}
            children="Drafted Templates"
            startIcon={<QueuePlayNextIcon
            />}
          /></Box>}
        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={(e, v) => setView(v)}
          aria-label="text alignment">
          <ToggleButton value="grid" aria-label="list">
            <GridOnIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="grid">
            <ListIcon />
          </ToggleButton>
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
                    <IconButton
                      onClick={() => {
                        history.push(`${path}${tile.id}`);
                      }}
                      aria-label={`info about ${tile.title}`}
                      className={classes.icon}>
                      <InfoIcon />
                    </IconButton>
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
              },
              {
                title: "Versions",
                render: ({ versions }) => <span>{versions.length}</span>,
              },
              {
                title: "Publish State",
                field: "publishState",
                render: function ({ publishState = "unpublished", rejectionReason = null }) {

                  return (
                    <Tooltip
                      TransitionComponent={Fade}
                      title={
                        rejectionReason ? publishState.toUpperCase() : rejectionReason
                      }>
                      <Chip
                        size="small"
                        label={publishState.toUpperCase()}
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
                defaultSort: "desc",
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
            actions={role === 'admin' ? [] : [{
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
              icon: "refresh",
              tooltip: "Refresh Data",
              isFreeAction: true,
              onClick: handleRetry,
            },
            ]}
            data={(query) =>
              fetch(`${uri}?page=${query.page + 1}&size=${query.pageSize}`)
                .then((response) => response.json())
                .then((result) => {
                  return {
                    data: query.search
                      ? result.data.filter(({ title }) =>
                        title
                          .toLowerCase()
                          .startsWith(query.search.toLowerCase())
                      )
                      : result.data,
                    page: query.page,
                    totalCount: query.search
                      ? result.data.filter(({ title }) =>
                        title
                          .toLowerCase()
                          .startsWith(query.search.toLowerCase())
                      ).length
                      : result.count,
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
            }
            options={{
              pageSize: 10,
              headerStyle: { fontWeight: 700 },
              minBodyHeight: 500,
              actionsColumnIndex: -1,
            }}
          />
        )}

      <TestJobDialog
        open={isDialogOpen}
        idVideoTemplate={testJobTemplate?.id ?? ''}
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