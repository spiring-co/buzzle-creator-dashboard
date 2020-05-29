import React from "react";
import { Link } from "@material-ui/core";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import MaterialTable from "material-table";
import { jobSchemaConstructor } from "services/helper";

const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
  "creatorId"
)}/videoTemplates`;

export default () => {
  let { url, path } = useRouteMatch();
  const history = useHistory();

  // TODO abstract to API
  const renderTestJob = async (data) => {
    try {
      var jobs = jobSchemaConstructor(data);
      console.log(jobs);
      await Promise.all(
        jobs.map((job) => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var raw = JSON.stringify(job);
          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };
          return fetch("http://localhost:5000/jobs", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(result);
            })
            .catch((error) => console.log("error", error));
        })
      );
      history.push("/home/jobs");
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
          icon: "delete",
          tooltip: "Delete Template",
          // TODO implement this
          onClick: (event, rowData) =>
            alert("Are you sure you want to delete."),
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
          })
      }
      options={{
        actionsColumnIndex: -1,
      }}
    />
  );
};
