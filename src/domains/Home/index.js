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
import { getInstanceInfo } from 'services/awsService'

export default () => {
  const [data, setData] = useState([]);
  const [avgRenderTime, setAvgRenderTime] = useState(0);
  const [avgRenderHour, setAvgRenderHour] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2021-02-28T21:11:54"));
  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [chartData, setChartData] = useState([]);
  const [jobsCountDay, setJobsCountDay] = useState(0);
  const [jobsCountWeek, setJobsCountWeek] = useState(0);
  const [jobsCountMonth, setJobsCountMonth] = useState(0);
  const [timeChartData, setTimeChartData] = useState([]);
  const [sum, setSum] = useState(0);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // useEffect(() => {
  //   getInstanceInfo()
  //   getDataFromQuery();
  //   jobsCountFetch();
  // }, []);

  // useEffect(() => {
  //   getDataFromQuery();
  // }, [startDate, endDate]);

  // useEffect(() => {
  //   const map = data.reduce(
  //     //to count frequency of array elements
  //     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
  //     new Map()
  //   );
  //   const result = [...map.entries()];
  //   const resultTwo = result.map((i) => {
  //     return { name: i[0], jobs: i[1] };
  //   });
  //   setChartData([...resultTwo]);
  //   console.log("changed chart data" + chartData);
  // }, [data]);

  // useEffect(() => {
  //   console.log(jobsCountWeek);
  // }, [jobsCountWeek]);

  // const jobsCountFetch = async () => {
  //   var d = new Date();
  //   var w = new Date();
  //   var m = new Date();
  //   var f = new Date();
  //   var day = new Date(d.setDate(d.getDate() - 1));
  //   var week = new Date(w.setDate(w.getDate() - 7));
  //   var month = new Date(m.setMonth(m.getMonth() - 1));
  //   console.log(day, week, month, f);
  //   getCountDay(f, day)
  //   getCountWeek(f, week)
  //   getCountMonth(f, month)
  //   // await getCount(f, day).then(setJobsCountDay)
  //   // await getCount(f, week).then(setJobsCountWeek)
  //   // await getCount(f, month).then(setJobsCountMonth)
  // };

  // const getCountDay = async (update, start) => {
  //   await fetch(`http://localhost:5000/stats/count?dateUpdated=${update}&dateStarted=${start}`)
  //     .then(response => response.json()).then(({ count }) => {
  //       console.log(count)
  //       return setJobsCountDay(count)
  //     })
  // }
  // const getCountWeek = async (update, start) => {
  //   await fetch(`http://localhost:5000/stats/count?dateUpdated=${update}&dateStarted=${start}`)
  //     .then(response => response.json()).then(({ count }) => {
  //       console.log(count)
  //       return setJobsCountWeek(count)
  //     })
  // }
  // const getCountMonth = async (update, start) => {
  //   await fetch(`http://localhost:5000/stats/count?dateUpdated=${update}&dateStarted=${start}`)
  //     .then(response => response.json()).then(({ count }) => {
  //       console.log(count)
  //       return setJobsCountMonth(count)
  //     })
  // }

  // useEffect(() => {
  //   const map = avgRenderHour.reduce(
  //     //to count frequency of array elements
  //     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
  //     new Map()
  //   );
  //   const result = [...map.entries()];
  //   const resultTwo = result
  //     .map((i) => {
  //       if (i[0] === 0) {
  //         return { name: 12 + " am", jobs: i[1] };
  //       }
  //       if (i[0] < 12) {
  //         return { name: i[0] + " am", jobs: i[1] };
  //       }
  //       if (i[0] === 12) {
  //         return { name: i[0] + " pm", jobs: i[1] };
  //       }
  //       if (i[0] > 12) {
  //         return { name: i[0] - 12 + " pm", jobs: i[1] };
  //       }
  //     })
  //     .sort((a, b) => {
  //       let i = a.name.split(" ");
  //       let j = b.name.split(" ");
  //       return i[0] - j[0];
  //     })
  //   setTimeChartData([...resultTwo]);
  //   console.log("changed chart data" + timeChartData);
  // }, [avgRenderHour]);

  // useEffect(() => {
  //   const c = chartData.map((m) => {
  //     return m.jobs;
  //   });
  //   var sum = c.reduce(function (a, b) {
  //     return a + b;
  //   }, 0);
  //   setSum(sum);
  // }, [chartData]);

  // const getDataFromQuery = async (query) => {
  //   console.log("yes")
  //   await fetch(`http://localhost:5000/stats/countTitles?page=${1}&size=${100}&sortBy=${`dateUpdated=>=${startDate}&dateUpdated=<=${endDate || startDate}`}&orderBy=${"dateUpdated"}`)
  //     .then(response => response.json()).then(({ data }) => {
  //       console.log("here, data", data);
  //       setData(
  //         data.map((j) => {
  //           if (j.videoTemplate !== null) {
  //             return j.videoTemplate.title;
  //           }
  //         })
  //       );
  //       const timeTaken = data.map((j) => {
  //         return j.renderTime;
  //       });
  //       setAvgRenderTime(
  //         timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length
  //       );
  //       const avgHour = data.map((j) => {
  //         return new Date(j.dateCreated);
  //       });
  //       setAvgRenderHour(
  //         avgHour
  //           .map((m) => {
  //             return m.getHours();
  //           })
  //           .sort()
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         data: [],
  //         page: query?.page,
  //         totalCount: 0,
  //       };
  //     }); // use fields query for quicker query and use it like ?fields=id,idVideoTemplate etc
  // };

  return (
    <div>
      <Typography variant="h4">Hello Creator!</Typography>
      {/* <Typography>
        Generic dashboard here with charts and graphs and an overview. */}
      {chartData?.length ? (
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
              {jobsCountDay ? (
                <Card style={{ marginTop: 10, margin: 4 }}>
                  <CardContent>
                    Jobs last day:{" "}
                    {<Typography variant="h8">{jobsCountDay}</Typography>}
                  </CardContent>
                  <CardContent>
                    Jobs last week:{" "}
                    {<Typography variant="h8">{jobsCountWeek}</Typography>}
                  </CardContent>
                  <CardContent>
                    Jobs last month:{" "}
                    {<Typography variant="h8">{jobsCountMonth}</Typography>}
                  </CardContent>
                </Card>) : (<div></div>)}
            </div>
            {/* <Card style={{ marginTop: 10, margin: 4 }}>
              <h3 style={{ marginLeft: 20 }}>Jobs per hour</h3>
              <CardContent>
                {timeChartData?.length ? (
                  <Graphs chartData={timeChartData} time={true}></Graphs>
                ) : (
                  <div></div>
                )}
              </CardContent>
            </Card> */}
          </div>
        </MuiPickersUtilsProvider>
      ) : (<div style={{ padding: 20 }}>Loading..</div>)}
    </div>
  );
};
