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
import { Alert } from "@material-ui/lab";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/videoTemplates`;
const x = 123;

export default () => {
  let { url, path } = useRouteMatch();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  return (
    <>
      {error && <Alert severity="error" children={`${error.message}`} />}
      <MaterialTable
        tableRef={tableRef}
        title="Your Video Templates"
        columns={[
          {
            title: "Id",
            field: "id",
            render: (rowData) => (
              <Link
                component={RouterLink}
                to={`${path}${rowData.id}`}
                children={rowData.id}
              />
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
            onClick: async (event, rowData) => {
              const action = window.confirm("Are you sure, you want to delete");
              if (!action) return;
              try {
                setIsDeleting(true);
                const response = await deleteTemplate(rowData.id);
                setIsDeleting(false);
                if (response.ok) {
                  tableRef.current && tableRef.current.onQueryChange();
                } else {
                  setError(new Error((await response.json()).message));
                }
              } catch (err) {
                setIsDeleting(false);
                alert(err.message);
              }
            },
          },
          {
            icon: "add",
            tooltip: "Add Video Template",
            isFreeAction: true,
            onClick: (event) => history.push(`${url}/add`),
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
