import React, { useEffect, useState } from "react";
import { LinearProgress, Paper, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { useRouteMatch, useHistory } from "react-router-dom";
import ErrorHandler from 'components/ErrorHandler'
const CustomProgress = withStyles({
    colorPrimary: {
        backgroundColor: "#b2dfdb",
    },
    barColorPrimary: {
        backgroundColor: "#00695c",
    },
})(LinearProgress);

export default () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(false)
    let history = useHistory();
    let { path } = useRouteMatch();

    const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem(
        "creatorId"
    )}/jobs`;

    useEffect(() => {
        getJobs();
    }, []);

    const getJobs = async () => {
        try {
            setError(null)
            setLoading(true)
            const result = await fetch(uri);
            var response = await result.json();

            setData(response);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err)
            console.log(err);
        }
    };

    if (error) return <ErrorHandler
        message={error?.message ?? "Oop's, Somethings went wrong!"}
        showRetry={true}
        onRetry={() => getJobs()} />
    return (
        <>
            {/* <SnackAlert
        message={status ? status?.message : err?.message ?? "Oop's, something went wrong, action failed !"}
        open={err || status}
        onClose={() => setStatusObj({ status: false, err: false })}
        type={status ? 'sucess' : "error"} /> */}
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
        </>
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