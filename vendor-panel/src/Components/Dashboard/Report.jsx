import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilArrowTop, cilOptions } from "@coreui/icons";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import axios from "axios";
import {
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CWidgetStatsA,
} from "@coreui/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect } from "react";
import { apiUrl } from "../../config/api.js";


function Report() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalIncome, setTotalIncome] = useState();
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [monthlyProducts, setMonthlyProducts] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [monthlyCustomers, setMonthlyCustomers] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const getIncome = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(apiUrl("dashboard/income"), {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });
      setTotalIncome(response.data.totalIncome);
      setMonthlyIncome(response.data.monthlyIncome);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    }
  };
  const getOrders = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(apiUrl("dashboard/orders"), {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });

      setOrdersCount(response.data.ordersCount);
      setMonthlyOrders(response.data.monthlyOrders);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    }
  };
  const getProducts = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(apiUrl("dashboard/products"), {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });

      setProductsCount(response.data.productsCount);
      setMonthlyProducts(response.data.monthlyProducts);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    }
  };
  const getCustomers = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(apiUrl("dashboard/customers"), {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });

      setCustomersCount(response.data.customersCount);
      setMonthlyCustomers(response.data.monthlyCustomers);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    }
  };
  useEffect(() => {
    getIncome();
    getOrders();
    getProducts();
    getCustomers();
  }, []);
  return (
    <>
      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <CRow className="flex ">
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                RS {totalIncome}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Income"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: monthlyIncome.map((item) => item.month),

                  datasets: [
                    {
                      label: "Income",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",

                      data: monthlyIncome.map((item) => item.income),

                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  onClick: function () {
                    const label = this?.data?.datasets?.[0]?.label;
                    if (label) setSelectedMetric(String(label).toLowerCase());
                  },
                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },

                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },

                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={
              <>
                {ordersCount}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Orders"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: monthlyOrders.map((item) => item.month),

                  datasets: [
                    {
                      label: "Orders",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",

                      data: monthlyOrders.map((item) => item.orders),

                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  onClick: function () {
                    const label = this?.data?.datasets?.[0]?.label;
                    if (label) setSelectedMetric(String(label).toLowerCase());
                  },
                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },

                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },

                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={
              <>
                {productsCount}{" "}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Products"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: monthlyProducts.map((item) => item.month),
                  datasets: [
                    {
                      label: "Products",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: monthlyProducts.map((item) => item.products),
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  onClick: function () {
                    const label = this?.data?.datasets?.[0]?.label;
                    if (label) setSelectedMetric(String(label).toLowerCase());
                  },
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={
              <>
                {customersCount}{" "}
                <span className="fs-6 fw-normal">
                  {/* (40.9% <CIcon icon={cilArrowTop} />) */}
                </span>
              </>
            }
            title="Customers"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: monthlyCustomers.map((item) => item.month),
                  datasets: [
                    {
                      label: "Customers",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: monthlyCustomers.map((item) => item.customers),
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  onClick: function () {
                    const label = this?.data?.datasets?.[0]?.label;
                    if (label) setSelectedMetric(String(label).toLowerCase());
                  },
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      {selectedMetric && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} monthly report
            </p>
            <button
              type="button"
              className="text-sm font-bold text-slate-500 hover:text-slate-800"
              onClick={() => setSelectedMetric("")}
            >
              Close
            </button>
          </div>
          <ul className="space-y-1 text-sm text-slate-600">
            {(selectedMetric === "income"
              ? monthlyIncome
              : selectedMetric === "orders"
                ? monthlyOrders
                : selectedMetric === "products"
                  ? monthlyProducts
                  : monthlyCustomers
            ).map((item, index) => (
              <li key={index}>
                {item.month}:{" "}
                {selectedMetric === "income"
                  ? item.income
                  : selectedMetric === "orders"
                    ? item.orders
                    : selectedMetric === "products"
                      ? item.products
                      : item.customers}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Report;
