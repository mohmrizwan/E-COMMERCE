import React from "react";
import { CChartDoughnut } from "@coreui/react-chartjs";

const CategoryChart = () => {
  const data = {
    labels: ["Electronics", "Fashion", "Shoes", "Accessories"],
    datasets: [
      {
        data: [35, 25, 20, 20],
      },
    ],
  };

  return (
    <CChartDoughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
      style={{ height: "300px" }}
    />
  );
};

export default CategoryChart;