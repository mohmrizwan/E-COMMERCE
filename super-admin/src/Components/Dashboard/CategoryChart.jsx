import React from "react";
import { CChartDoughnut } from "@coreui/react-chartjs";

const CategoryChart = () => {
  const data = {
    labels: ["Electronics", "Fashion", "Shoes", "Accessories"],

    datasets: [
      {
        data: [35, 25, 20, 20],

        backgroundColor: [
          "#70207B",
          "#8B2595",
          "#B83E91",
          "#B52AC2",
        ],

        borderColor: "#FFFFFF",
        borderWidth: 3,

        hoverOffset: 6,
      },
    ],
  };

  return (
    <CChartDoughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,

        cutout: "65%",

        plugins: {
          legend: {
            position: "bottom",

            labels: {
              color: "#7A6A76",

              padding: 18,

              usePointStyle: true,
              pointStyle: "circle",

              font: {
                size: 12,
                family: "Inter, sans-serif",
              },
            },
          },

          tooltip: {
            backgroundColor: "#111111",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",

            padding: 10,

            cornerRadius: 8,
          },
        },
      }}
      style={{
        height: "300px",
      }}
    />
  );
};

export default CategoryChart;

