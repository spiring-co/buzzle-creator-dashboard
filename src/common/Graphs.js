import React, { useMemo, useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
// import { Job } from "services/api";

export default (chartData) => {
//   const [data, setData] = useState([]);
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     getDataFromQuery();
//   }, []);

//   useEffect(() => {
//     const map = data.reduce(
//       (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
//       new Map()
//     );
//     const result = [...map.entries()];
//     const resultTwo = result.map((i) => {
//       return { name: i[0], uses: i[1] };
//     });
//     setChartData(resultTwo);
//   }, [data]);

//   useEffect(() => {}, [chartData]);

  //   const getDataFromQuery = (query) => {
  //     const {
  //       page = 0,
  //       pageSize = 100,
  //       orderBy: { field: orderBy = "dateUpdated" } = {},
  //       orderDirection = "asc",
  //     } = query;
  //     return Job.getAll(page + 1, pageSize, orderBy, orderDirection)
  //       .then(({ data, count: totalCount }) => {
  //         setData(
  //           data.map((j) => {
  //             if (j.state !== "error" && j.videoTemplate !== null) {
  //               return j.videoTemplate.title;
  //             }
  //           })
  //         );
  //         return { data, page, totalCount };
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         return {
  //           data: [],
  //           page: query?.page,
  //           totalCount: 0,
  //         };
  //       });
  //   };

  return (
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
  );
};
