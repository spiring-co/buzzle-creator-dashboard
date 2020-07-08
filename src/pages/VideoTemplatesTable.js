import React, { useState, useRef, useEffect } from "react";
import { Link, Typography, Button } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import MaterialTable from "material-table";
import { VideoTemplate, Job } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import SnackAlert from "components/SnackAlert";
import ReactJson from "react-json-view";
import * as timeago from "timeago.js";
import { useAuth } from "services/auth";

export default (props) => {
  let { url, path } = useRouteMatch();
  var PROJECT_URL = "https://wozlstmqvqfktdb.form.io";
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const tableRef = useRef(null);
  const { user } = useAuth();
  const uri = `${process.env.REACT_APP_API_URL}/creators/${user?.id}/videoTemplates`;
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
    <>
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
            ? status?.message ?? "Deleted Sucessfully"
            : err?.message ?? "Oops, something went wrong, action failed !"
        }
        onClose={() => setDeleteStatus({ status: false, err: false })}
      />
      <div className={classes.root}>
        <GridList cellHeight={250} className={classes.gridList}>
          <GridListTile
            key="Subheader"
            cols={2}
            style={{ height: "auto" }}></GridListTile>
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
      </div>

      {/* <MaterialTable
        tableRef={tableRef}
        title="Your Video Templates"
        columns={[
          {
            title: "Title",
            render: ({ id, title }) => (
              <Link
                component={RouterLink}
                to={`${path}${id}`}
                children={title}
              />
            ),
          },
          {
            title: "Versions",
            render: ({ versions }) => <span>{versions.length}</span>,
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
                children={"retry?"}
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
        actions={[
          {
            icon: "alarm-on",
            tooltip: "Render Test Job",
            onClick: (event, rowData) => {
              Job.renderTests(rowData);
              history.push("/home/jobs");
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
                data: result.data.filter((item) => !item.isDeleted),
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
        }
        options={{
          pageSize: 10,
          headerStyle: { fontWeight: 700 },
          minBodyHeight: 500,
          actionsColumnIndex: -1,
        }}
      /> */}
    </>
  );
};
