import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

export default ({ chartData }) => {
  const [values, setValues] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    console.log(chartData, "graphs.js ");
    setValues(
      chartData?.map((c) => {
        return c.jobs;
      })
    );
    setLabels(
      chartData?.map((c) => {
        return c.name;
      })
    );
  }, [chartData]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of jobs",
        backgroundColor: "rgba(56,68,252)",
        borderColor: "rgba(56,68,252,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(56,68,252,0.8)",
        hoverBorderColor: "rgba(56,68,252,1)",
        data: values,
      },
    ],
  };

  return (
    <div >
      <Bar
        data={data}
        width={410}
        height={310}
        redraw={true}
        options={{
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
};
