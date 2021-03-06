import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import useApi from "services/apiHook";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { Job } from "services/api";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// import Graphs from "../../common/Graphs";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

// import { Chart } from "react-charts";

export default () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2021-02-28T21:11:54"));
  const [endDate, setEndDate] = useState(new Date("2021-03-05T21:11:54"));
  const [chartData, setChartData] = useState([]);
  const [sum, setSum] = useState(0);
  const [lineChart, setLineChart] = useState(false);
  // const { data, loading, error } = useApi(
  //   "http://34.229.239.151:3050/api/v1/jobs",
  //   {
  //     headers: { "nexrender-secret": "myapisecret" },
  //   }
  // );
  const handleChange = (event) => {
    setLineChart(event.target.checked);
    console.log(lineChart);
  };
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

  useEffect(() => {
    const c = chartData.map((m) => {
      return m.uses;
    });
    var sum = c.reduce(function (a, b) {
      return a + b;
    }, 0);
    setSum(sum);
  }, [chartData]);

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
      }); // use fields query for quicker query and use it like ?fields=id,idVideoTemplate etc
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
            <FormControlLabel
              control={
                <Switch
                  checked={lineChart}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Line Chart"
            />
          </Grid>
          {/* <Graphs chartData={chartData}></Graphs> */}
          {lineChart ? (
            <LineChart
              width={600}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="uses" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          ) : (
            <BarChart width={600} height={300} data={chartData}>
              <XAxis  dataKey="name" />
              <YAxis />
              <Bar dataKey="uses" barSize={10} fill="#8884d8" />
              <Tooltip />
            </BarChart>
          )}
        </MuiPickersUtilsProvider>
      </Typography>
      {sum ? <Typography variant="h8">Sum of Jobs : {sum}</Typography> : ""}
    </div>
  );
};
