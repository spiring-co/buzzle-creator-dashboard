import React, { useState, useRef } from "react";
import { Link, Typography, Button, Container } from "@material-ui/core";
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
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

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

  const [deleteStatus, setDeleteStatus] = useState(
    props?.location?.state?.statusObj ?? { status: false, err: false }
  );

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
            ? status?.message ?? "Deleted Sucessfully"
            : err?.message ?? "Oop's, something went wrong, action failed !"
        }
        onClose={() => setDeleteStatus({ status: false, err: false })}
      />
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
            onClick: async (event, rowData) => {
              try {
                await Job.renderTests(rowData);
                history.push("/home/jobs");
              } catch (e) {
                setError(e);
              }
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
      />
    </Container>
  );
};
