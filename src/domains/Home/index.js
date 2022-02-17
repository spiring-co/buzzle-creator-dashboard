import { Paper, Button, Container } from "@material-ui/core";
import Filters from "common/Filters";
import React from "react";
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import { PivotData } from "react-pivottable/Utilities";
import Graphs from "common/Graphs";
import AlertHandler from "common/AlertHandler";
import { useAuth } from "services/auth";
import EmailVerifyAlert from "common/EmailVerifyAlert";

// function jobHeuristicMapper(jobs) {
//   return jobs.map((job) => {
//     return {
//       "Created By": job.createdBy?.name ?? "Unknown",
//       "Video Template": job.videoTemplate?.title ?? "Untitled",
//       State: job.state ?? "Unknown",
//       "Updated At": job.dateUpdated.toString().substring(0, 10),
//     };
//   });
// }

export default function Home() {
  const { user } = useAuth()
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [jobs, setJobs] = React.useState([]);
  // const [pivotState, setPivotState] = React.useState({});
  // const [filters, setFilters] = React.useState({
  //   startDate: "2021-05-09T11:37:00.000Z",
  // });

  // React.useEffect(() => {
  //   // setIsLoading(true);
  //   // Job.getAll(1, 20000, filterObjectToString(filters))
  //   //   .then((j) => setJobs(jobHeuristicMapper(j.data)))
  //   //   .then((_) => setIsLoading(false));
  // }, [filters]);

  // console.log(filters);

  // const exportData = () => {
  //   var pivotData = new PivotData(pivotState);

  //   var rowKeys = pivotData.getRowKeys();
  //   var colKeys = pivotData.getColKeys();
  //   if (rowKeys.length === 0) {
  //     rowKeys.push([]);
  //   }
  //   if (colKeys.length === 0) {
  //     colKeys.push([]);
  //   }

  //   var headerRow = pivotData.props.rows.map(function (r) {
  //     return r;
  //   });
  //   if (colKeys.length === 1 && colKeys[0].length === 0) {
  //     headerRow.push(pivotState.aggregatorName);
  //   } else {
  //     colKeys.map(function (c) {
  //       return headerRow.push(c.join("-"));
  //     });
  //   }

  //   var result = rowKeys.map(function (r) {
  //     var row = r.map(function (x) {
  //       return x;
  //     });
  //     colKeys.map(function (c) {
  //       var v = pivotData.getAggregator(r, c).value();
  //       row.push(v ? v : "");
  //     });
  //     return row;
  //   });

  //   result.unshift(headerRow);

  //   const content = result
  //     .map(function (r) {
  //       return r.join(",");
  //     })
  //     .join("\n");

  //   download("data.csv", content);
  // };

  // render data
  return (
    <Container >
      <EmailVerifyAlert />
      {/* <Graphs /> */}
    </Container>


  );
}

// const filterObjectToString = (f) => {
//   if (!f) return null;
//   const { startDate = 0, endDate = 0, idVideoTemplates = [], states = [] } = f;

//   return `${
//     startDate
//       ? `dateUpdated=>=${startDate}&${
//           endDate ? `dateUpdated=<=${endDate || startDate}&` : ""
//         }`
//       : ""
//   }${
//     idVideoTemplates.length !== 0
//       ? getArrayOfIdsAsQueryString(
//           "idVideoTemplate",
//           idVideoTemplates.map(({ id }) => id)
//         ) + "&"
//       : ""
//   }${states.length !== 0 ? getArrayOfIdsAsQueryString("state", states) : ""}`;
// };

// const getArrayOfIdsAsQueryString = (field, ids) => {
//   return ids
//     .map((id, index) => `${index === 0 ? "" : "&"}${field}[]=${id}`)
//     .toString()
//     .replace(/,/g, "");
// };

// function download(filename, text) {
//   var element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
//   );
//   element.setAttribute("download", filename);

//   element.style.display = "none";
//   document.body.appendChild(element);

//   element.click();

//   document.body.removeChild(element);
// }
