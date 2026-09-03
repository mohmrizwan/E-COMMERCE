import React from "react";
import { CChartBar } from "@coreui/react-chartjs";
const OrdersChart = () => {
  const data = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Orders",
        data: [25, 40, 35, 120, 10],
        backgroundColor: "#B83E91",
        hoverBackgroundColor: "#70207B",
        borderColor: "#B83E91",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.65,
        categoryPercentage: 0.7,
      },
    ],
  };
  return (
    <CChartBar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111111",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#7A6A76", font: { size: 12 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#E6C5DE", drawBorder: false },
            ticks: { color: "#7A6A76", font: { size: 12 } },
            border: { display: false },
          },
        },
      }}
      style={{ height: "300px" }}
    />
  );
};
export default OrdersChart;
