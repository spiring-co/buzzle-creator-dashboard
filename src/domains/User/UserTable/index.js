import {
  Box, Chip, Tooltip,
  Container,
  GridList,
  GridListTile,
  GridListTileBar, Fade,
  IconButton,
  Link, Avatar,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import {useAPI} from "services/APIContext";
import PublishIcon from '@material-ui/icons/Publish';
import AlertHandler from "common/AlertHandler";
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
import * as timeago from "timeago.js";

export default (props) => {
  let { url, path } = useRouteMatch();
  const history = useHistory();
  const { Job, VideoTemplate, User, }=useAPI()
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [testJobTemplate, setTestJobTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [view, setView] = useState("list");
  const tableRef = useRef(null);
  const { user } = useAuth();
  const { role } = user
  const uri = `${process.env.REACT_APP_API_URL}/creators/`;
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
      setData(await User.getAll(1, 10));
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
        <AlertHandler
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

      </Box>
      <MaterialTable
        tableRef={tableRef}
        title="Creators"
        onRowClick={(e, { id }) => {
          history.push(`${path}${id}`);
        }}
        columns={[
          {
            title: "Name",
            field: "name",
            //change thumbnail to imageUrl and title to name
            render: ({ imageUrl, name }) => <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Avatar style={{ marginRight: 10, height: 30, width: 30 }} alt="thumbnail" src={imageUrl} />
              {name}
            </div>
          },
          {
            title: "Creator Id",
            field: "id",

          },
          {
            title: "Email",
            field: "email",
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: <Typography>No Creator Found.</Typography>
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
          // query?.search ?
          //   Search.getCreators(query?.search, query.page + 1, query.pageSize).then(({ data, count: totalCount }) => ({
          //     data,
          //     page: query.page,
          //     totalCount
          //   })).catch((err) => {
          //     setError(err);
          //     return {
          //       data: [],
          //       page: query.page,
          //       totalCount: 0,
          //     };
          //   }) :
            User.getAll(query.page + 1, query.pageSize)
              .then(({ data, count: totalCount }) => {
                return {
                  data,
                  page: query.page,
                  totalCount,
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