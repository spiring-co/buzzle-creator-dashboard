import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import useApi from "services/apiHook";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { Job } from "services/api";

export default () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2020-08-18T21:11:54"));
  const [endDate, setEndDate] = useState(new Date("2020-12-18T21:11:54"));
  const [chartData, setChartData] = useState([]);
  // const { data, loading, error } = useApi(
  //   "http://34.229.239.151:3050/api/v1/jobs",
  //   {
  //     headers: { "nexrender-secret": "myapisecret" },
  //   }
  // );
  const handleStartDateChange = (date) => {
    console.log(date);
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    getDataFromQuery();
    console.log("changed query data");
  }, [startDate, endDate]);

  useEffect(() => {
    const map = data.reduce(
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    );
    const result = [...map.entries()];
    const resultTwo = result.map((i) => {
      return { name: i[0], uses: i[1] };
    });
    setChartData([...resultTwo]);
    console.log("changed chart data" + chartData);
  }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error.message}</p>;
  // if (data) {
  //   return <pre>{JSON.stringify(data, null, 2)}</pre>;
  // }

  const getDataFromQuery = (query) => {
    console.log("working");
    return Job.getAll(
      1, //-1 after api updates
      100,
      `dateUpdated=>=${startDate}&dateUpdated=<=${endDate || startDate}`,
      "dateUpdated",
      "desc"
    )
      .then(({ data, count: totalCount }) => {
        setData(
          data.map((j) => {
            if (j.state !== "error" && j.videoTemplate !== null) {
              return j.videoTemplate.title;
            }
          })
        );
      })
      .catch((err) => {
        console.log(err);
        return {
          data: [],
          page: query?.page,
          totalCount: 0,
        };
      });
  };
  return (
    <div>
      <Typography variant="h4">Hello Creator!</Typography>
      <Typography>
        Generic dashboard here with charts and graphs and an overview.
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid>
            <KeyboardDatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        {/* <BarChart width={600} height={300} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="uses" fill="#8884d8" barSize={30} />
        </BarChart> */}
        {/* <LineChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="uses" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart> */}
      </Typography>
    </div>
  );
};
