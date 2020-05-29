import React, { useState } from "react";
import { Link, CircularProgress } from "@material-ui/core";
import { Delete } from '@material-ui/icons'
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import MaterialTable from "material-table";
import { renderTestJob, deleteTemplate } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import SnackAlert from 'components/SnackAlert'
const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/videoTemplates`;

export default (props) => {
  let { url, path } = useRouteMatch();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState(props?.location?.state?.deleteStatus ?? { status: false, err: false })
  if (error) {
    return <ErrorHandler message={error.message} showRetry={true} onRetry={() => setError(false)} />
  }
  let { status, err } = deleteStatus
  return (
    <>
      <SnackAlert
        open={err || status}
        type={status ? 'success' : 'error'}
        message={status ? 'Deleted Sucesfully' : "Oop's, something went wrong, action failed !"}
        onClose={() => setDeleteStatus({ status: false, err: false })}
      />
      <MaterialTable
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
        ]}
        actions={[
          {
            icon: "save",
            tooltip: "Render Test Job",
            onClick: (event, rowData) => renderTestJob(rowData),
          },
          {
            icon: () => isDeleting ? <CircularProgress size={20} /> : <Delete />,
            tooltip: "Delete Template",

            onClick: async (event, rowData) => {
              var action = window.confirm("Are you sure, you want to delete");
              if (action) {
                try {
                  setIsDeleting(true);
                  const response = await deleteTemplate(rowData.id)
                  setIsDeleting(false);
                  if (response.ok) {

                    setDeleteStatus({ status: true, err: true })
                  }
                } catch (err) {
                  setIsDeleting(false);
                  setDeleteStatus({ status: false, err: true })
                }
              }
            }
          },
          {
            icon: "add",
            tooltip: "Add Video Template",
            isFreeAction: true,
            onClick: (event) => history.push(`${url}/add`),
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
            }).catch(err => setError(err))
        }
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </>
  );
};
