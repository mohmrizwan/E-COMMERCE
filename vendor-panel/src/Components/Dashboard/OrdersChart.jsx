import React from "react";
import { CChartBar } from "@coreui/react-chartjs";

const OrdersChart = () => {
  const data = {
    labels: [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],

    datasets: [
      {
        label: "Orders",
        data: [25, 40, 35, 120, 10],
      },
    ],
  };

  return (
    <CChartBar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
      style={{ height: "300px" }}
    />
  );
};

export default OrdersChart;