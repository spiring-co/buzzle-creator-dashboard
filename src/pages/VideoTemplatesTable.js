import React, { useState, useRef } from "react";
import { Link, CircularProgress, Typography, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import MaterialTable from "material-table";
import { Job } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import SnackAlert from "components/SnackAlert";
import ReactJson from "react-json-view";
import * as timeago from "timeago.js";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/videoTemplates`;

export default (props) => {
  let { url, path } = useRouteMatch();
  const history = useHistory();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

  const handleDelete = async (id) => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      await Job.delete(id);
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
            : err?.message ?? "Oop's, something went wrong, action failed !"
        }
        onClose={() => setDeleteStatus({ status: false, err: false })}
      />
      <MaterialTable
        tableRef={tableRef}
        title="Your Video Templates"
        columns={[
          {
            title: "Id",
            field: "id",
            render: ({ id }) => (
              <Link component={RouterLink} to={`${path}${id}`} children={id} />
            ),
          },
          {
            title: "Title",
            field: "title",
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
            icon: () =>
              isDeleting ? <CircularProgress size={20} /> : <Delete />,
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
              delete data['tableData']
              history.push({
                pathname: `${url}/${data.id}/edit`,
                state: {
                  isEdit: true,
                  video: data,
                }
              })
            }
          }
          ,
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
      />
    </>
  );
};
