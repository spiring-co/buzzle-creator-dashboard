import React, { useEffect, useState } from "react";
import { LinearProgress, Paper, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import JobDetails from "./JobDetails";
import { Route, Switch, useRouteMatch, useHistory } from "react-router-dom";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

export default () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/`} exact component={JobsTable} />
      <Route path={`${path}/:jobId`} component={JobDetails} />
    </Switch>
  );
};

// TODO abstract to separate file
const JobsTable = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  let history = useHistory();
  let { path } = useRouteMatch();

  // TODO Abstract to api
  const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
    "creatorId"
  )}/jobs`;

  useEffect(() => {
    // make fetch call to fetch Jobs
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const result = await fetch(uri);
      var response = await result.json();

      setData(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <MaterialTable
      isLoading={loading}
      title="Your Jobs"
      columns={[
        { title: "Job Id", field: "id" },
        { title: "Video Template Id", field: "idVideoTemplate" },
        { title: "Version Id", field: "idVersion" },
        {
          title: "State",
          field: "state",
          render: ({ state }) => (
            <Chip
              size="small"
              label={state}
              style={{ background: getColorFromState(state), color: "white" }}
            />
          ),
        },
      ]}
      data={data}
      onRowClick={(e, rowData) => {

        history.push(`${path}${rowData.id}`, {
          jobDetails: rowData,
        });
      }}
    />
  );
};

const getColorFromState = (state) => {
  console.log(state);
  switch (state) {
    case "finished":
      return "#4caf50";
    case "error":
      return "#f44336";
    default:
      return "grey";
  }
};
