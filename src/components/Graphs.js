// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
// import { Job } from "services/api";
// import {
//   KeyboardDatePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

// export default (from = "", to = "") => {
  // const [data, setData] = useState([]);
  // const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   getDataFromQuery("");
  // }, []);

  // useEffect(() => {
  //   const map = data.reduce(
  //     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
  //     new Map()
  //   );
  //   const result = [...map.entries()];
  //   const resultTwo = result.map((i) => {
  //     return { name: i[0], uses: i[1] };
  //   });
  //   setChartData(resultTwo);
  // }, [data]);

  // useEffect(() => {}, [chartData]);

  // const getDataFromQuery = (query) => {
  //   const {
  //     page = 0,
  //     pageSize = 100,
  //     orderBy: { field: orderBy = "dateUpdated" } = {},
  //     orderDirection = "asc",
  //     graph = true,
  //     // gte = greaterThan,
  //     // lt = lessThan,
  //   } = query;
  //   return Job.getAll(page + 1, pageSize, orderBy, orderDirection)
  //     .then(({ data, count: totalCount }) => {
  //       setData(
  //         data.map((j) => {
  //           if (j.state !== "error" && j.videoTemplate !== null) {
  //             return j.videoTemplate.title;
  //           }
  //         })
  //       );
  //       return { data, page, totalCount };
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return {
  //         data: [],
  //         page: query?.page,
  //         totalCount: 0,
  //       };
  //     });
  // };

//   return (
    // <LineChart
    //   width={600}
    //   height={300}
    //   data={chartData}
    //   margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    //   <Line type="monotone" dataKey="uses" stroke="#8884d8" />
    //   <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    //   <XAxis dataKey="name" />
    //   <YAxis />
    //   <Tooltip />
    // </LineChart>
//   );
// };

// {
//   /* <div> */
// }
// {
//   /* <MuiPickersUtilsProvider utils={DateFnsUtils}>
//         <KeyboardDatePicker
//           style={{ width: 150, marginBottom: 0 }}
//           disableToolbar
//           margin="dense"
//           format="MM/dd/yyyy"
//           id="date-picker-inline"
//           label="Start date"
//           value={value?.startDate ?? null}
//           onChange={(v) =>
//             setFilters({ ...filters, startDate: new Date(v).toISOString() })
//           }
//           KeyboardButtonProps={{
//             "aria-label": "change date",
//           }}
//         />
//         <KeyboardDatePicker
//           margin="dense"
//           style={{
//             marginLeft: 10,
//             width: 150,
//             marginRight: 10,
//             marginBottom: 0,
//           }}
//           disableToolbar
//           format="MM/dd/yyyy"
//           id="date-picker-inline"
//           label="End date"
//           value={value?.endDate ?? null}
//           onChange={(v) =>
//             setFilters({ ...filters, endDate: new Date(v).toISOString() })
//           }
//           KeyboardButtonProps={{
//             "aria-label": "change date",
//           }}
//         />
//       </MuiPickersUtilsProvider> */
// }
