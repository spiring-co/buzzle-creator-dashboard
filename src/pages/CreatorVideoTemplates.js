import React, { useState, useRef } from "react";
import { Link, CircularProgress } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import MaterialTable from "material-table";
import { renderTestJob, deleteTemplate } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import SnackAlert from "components/SnackAlert";
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
      const response = await deleteTemplate(id);
      if (!response.status === 200) {
        throw new Error((await response.json()).message);
      }
    } catch (err) {
      console.log(err)
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
            ? status?.message ?? "Deleted Sucesfully"
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
          { title: "Created At", field: "dateCreated", type: "datetime" },
        ]}
        actions={[
          {
            icon: "alarm-on",
            tooltip: "Render Test Job",
            onClick: (event, rowData) => renderTestJob(rowData),
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
          headerStyle: { fontWeight: 700 },
          minBodyHeight: 500,
          actionsColumnIndex: -1,
        }}
      />
    </>
  );
};
