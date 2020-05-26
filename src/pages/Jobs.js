import React, { useEffect, useState } from "react";
import { Typography, LinearProgress, Paper } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
    container: {
        margin: 20,
        padding: 30,
    },
}));

export default () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/`} exact component={JobsTable} />
            <Route path={`${path}/:jobId`} component={JobDetails} />
        </Switch>
    );
};

const JobsTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let history = useHistory();
    const classes = useStyles();
    let { path } = useRouteMatch();
    const uri = `${process.env.REACT_APP_API_URL}/${localStorage.getItem('creatorId')}/jobs`;

    useEffect(() => {
        // make fetch call to fetch Jobs
        getJobs();
    }, []);
    const getJobs = async () => {
        try {
            const result = await fetch(uri);
            var response = await result.json();

            setData([response]);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    if (loading) {
        return (
            <Paper style={{ height: 400 }}>
                <CustomProgress />{" "}
            </Paper>
        );
    }

    return (
        <div className={classes.container}>
            <MaterialTable
                options={{
                    rowStyle: (data, index) => ({
                        backgroundColor: index % 2 !== 0 ? "#d9dbde" : "white",
                    }),
                }}
                title="Your Jobs"
                columns={[
                    { title: "Job Id", field: "id" },
                    { title: "Video Template Id", field: "idVideoTemplate" },
                    { title: "Version Id", field: "idVersion" },
                    {
                        title: "State",
                        field: "state",
                        cellStyle: (data, rowdata) => ({
                            color: data === "created" ? "green" : "red",
                        }),
                    },
                ]}
                data={data}
                onRowClick={(e, rowData) => {
                    history.push(`${path}${rowData.id}`, {
                        jobDetails: rowData,
                    });
                }}
            />
        </div>
    );
};
