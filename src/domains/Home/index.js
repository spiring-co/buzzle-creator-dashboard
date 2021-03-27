import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { Job } from "services/api";
import Graphs from "../../common/Graphs";

export default () => {
  const [data, setData] = useState([]);
  const [avgRenderTime, setAvgRenderTime] = useState(0);
  const [avgRenderHour, setAvgRenderHour] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2021-02-28T21:11:54"));
  const [endDate, setEndDate] = useState(new Date("2021-03-05T21:11:54"));
  const [chartData, setChartData] = useState([]);
  const [jobsTime, setJobsTime] = useState(1);
  const [jobsCount, setJobsCount] = useState(1);
  const [timeChartData, setTimeChartData] = useState([]);
  const [sum, setSum] = useState(0);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    jobsCountFetch();
  }, []);

  useEffect(() => {
    getDataFromQuery();
  }, [startDate, endDate]);

  useEffect(() => {
    const map = data.reduce(
      //to count frequency of array elements
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    );
    const result = [...map.entries()];
    const resultTwo = result.map((i) => {
      return { name: i[0], jobs: i[1] };
    });
    setChartData([...resultTwo]);
    console.log("changed chart data" + chartData);
  }, [data]);

  useEffect(() => {
    console.log(jobsTime);
    jobsCountFetch();
  }, [jobsTime]);

  const jobsCountFetch = () => {
    fetch(
      `http://localhost:5000/jobs/count?dateUpdated=${Date.now()}&dateStarted=${
        Date.now() - jobsTime
      }`
    )
      .then((response) => response.json())
      .then((data) => setJobsCount(data));
  };

  useEffect(() => {
    const map = avgRenderHour.reduce(
      //to count frequency of array elements
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    );
    const result = [...map.entries()];
    const resultTwo = result.map((i) => {
      return { name: i[0], jobs: i[1] };
    });
    setTimeChartData([...resultTwo]);
    console.log("changed chart data" + timeChartData);
  }, [avgRenderHour]);

  useEffect(() => {
    const c = chartData.map((m) => {
      return m.jobs;
    });
    var sum = c.reduce(function (a, b) {
      return a + b;
    }, 0);
    setSum(sum);
  }, [chartData]);

  const getDataFromQuery = (query) => {
    console.log("working");
    return Job.getAll(
      1,
      100,
      `dateUpdated=>=${startDate}&dateUpdated=<=${endDate || startDate}`,
      "dateUpdated",
      "desc"
    )
      .then(({ data, count: totalCount }) => {
        console.log(data);
        setData(
          data.map((j) => {
            if (j.state !== "error" && j.videoTemplate !== null) {
              return j.videoTemplate.title;
            }
          })
        );
        const timeTaken = data.map((j) => {
          return j.renderTime;
        });
        setAvgRenderTime(
          timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length
        );
        const avgHour = data.map((j) => {
          return new Date(j.dateCreated);
        });
        setAvgRenderHour(
          avgHour
            .map((m) => {
              return m.getHours();
            })
            .sort()
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
      {/* <Typography>
        Generic dashboard here with charts and graphs and an overview. */}
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Card style={{ marginTop: 10, margin: 4 }}>
            <h3 style={{ marginLeft: 20 }}>Jobs per invite</h3>
            <CardContent>
              {chartData?.length ? (
                <Graphs chartData={chartData}></Graphs>
              ) : (
                <div></div>
              )}
            </CardContent>
          </Card>
          <div>
            {avgRenderTime ? (
              <Card style={{ marginTop: 10, margin: 4 }}>
                <CardContent>
                  <Typography variant="h10">
                    Average render time of Jobs :{" "}
                  </Typography>
                  <Typography variant="h5">
                    {Math.round(avgRenderTime / 1000)} seconds
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              ""
            )}
            {sum ? (
              <Card style={{ margin: 4 }}>
                <CardContent>
                  <Typography variant="h10">Sum of Jobs : {""}</Typography>
                  <Typography variant="h5">{sum} jobs</Typography>
                </CardContent>
              </Card>
            ) : (
              ""
            )}
            {jobsCount ? (
              <Card style={{ marginTop: 10, margin: 4 }}>
                <Button size="small" onClick={() => setJobsTime(30)}>
                  month
                </Button>
                <Button size="small" onClick={() => setJobsTime(7)}>
                  week
                </Button>
                <Button size="small" onClick={() => setJobsTime(1)}>
                  day
                </Button>
                <CardContent> {jobsCount.count}</CardContent>
              </Card>
            ) : (
              <div></div>
            )}
          </div>
          <Card style={{ marginTop: 10, margin: 4 }}>
            <h3 style={{ marginLeft: 20 }}>Jobs per hour</h3>
            <CardContent>
              {timeChartData?.length ? (
                <Graphs chartData={timeChartData}></Graphs>
              ) : (
                <div></div>
              )}
            </CardContent>
          </Card>
        </div>
      </MuiPickersUtilsProvider>
      {/* </Typography>  */}
    </div>
  );
};
