import React, { useState, useRef } from "react";
import { Link, CircularProgress, Typography } from "@material-ui/core";
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

  if (error) {
    return (
      <ErrorHandler
        message={error.message}
        showRetry={true}
        onRetry={() => setError(false)}
      />
    );
  }
  let { status, err } = deleteStatus;
  return (
    <>
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
            title: "Description",
            field: "description",
          },
          { title: "Last Updated", field: "dateUpdated", type: "datetime" },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: (
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
            onClick: (e, { id }) => history.push(`${url}/${id}/edit`),
          },
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
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
            .catch((err) => setError(err))
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
