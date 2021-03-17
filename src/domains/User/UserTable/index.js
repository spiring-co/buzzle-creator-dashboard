import {
  Box,
  Container,
  Typography,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {  VideoTemplate } from "services/api";
import ErrorHandler from "common/ErrorHandler";
import SnackAlert from "common/SnackAlert";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useAuth } from "services/auth";


export default (props) => {
  let { url, path } = useRouteMatch();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const { user } = useAuth();
  // const uri = `${process.env.REACT_APP_API_URL}/creators/${user?.id}/videoTemplates`;
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
  useEffect(() => {
    const data = async () => {
      const response = await VideoTemplate.getAll(1, 10); //new api change
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
        p={1}></Box>
      <MaterialTable
        tableRef={tableRef}
        title="Users"
        onRowClick={(e, { id }) => {
          history.push(`${path}${id}`);
        }}
        columns={[
          {
            title: "Name",
            render: ({ thumbnail, title }) => (
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
            title: "API Key",
            field: "title",
            render: ({ versions }) => <span>9867y89xwtgiuegdi79</span>,
          },
          {
            title: "Email",
            field: "email",
            render: ({ versions }) => <span>{versions.length}</span>,
          },

          {
            title: "Phone Number",
            field: "dateUpdated",
            type: "datetime",
            render: ({ dateUpdated }) => <span>554545454545</span>,
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: <Typography>No Creator Found.</Typography>,
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
        data={(query) =>
          VideoTemplate.getAll(query.page + 1, query.pageSize)//new api change //TODO change to user all
            .then((result) => {
              return {
                data: query.search
                  ? result.data.filter(({ title }) =>
                      title?.toLowerCase()?.startsWith(query?.search?.toLowerCase())
                    )
                  : result.data,
                page: query.page,
                totalCount: query.search
                  ? result.data.filter(({ title }) =>
                      title?.toLowerCase()?.startsWith(query?.search?.toLowerCase())
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
    </Container>
  );
};
