import { useEffect, useState } from "react";
import "./App.css";
import { SummaryCards } from "./components/SummaryCards";
import { FormCard } from "./components/FormCard";
import { TableContainer } from "./components/TableContainer";
import { formatTimestamp, getActionColor } from "./utils/helpers";

const endpoints = {
  restaurants: "/restaurants",
  orders: "/orders",
  payments: "/payments",
  logs: "/logs",
};

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("restaurants");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tabletrack-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("tabletrack-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadAllData();
  }, []);

  const callApi = async (path, options = {}) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }

      const text = await response.text();
      if (!text) return null;

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (err) {
      setError(err.message || "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    const [restaurantData, orderData, paymentData, logData] = await Promise.all([
      callApi(endpoints.restaurants),
      callApi(endpoints.orders),
      callApi(endpoints.payments),
      callApi(endpoints.logs),
    ]);

    if (restaurantData) setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
    if (orderData) setOrders(Array.isArray(orderData) ? orderData : []);
    if (paymentData) setPayments(Array.isArray(paymentData) ? paymentData : []);
    if (logData) setLogs(Array.isArray(logData) ? logData : []);
  };

  const submitRestaurant = async (formData) => {
    if (!formData.name || !formData.address || !formData.cuisine) {
      setError("Please fill in all restaurant fields.");
      return;
    }

    await callApi(endpoints.restaurants, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    loadAllData();
  };

  const submitOrder = async (formData) => {
    if (!formData.restaurantId || !formData.customerName || !formData.amount) {
      setError("Please fill in all order fields.");
      return;
    }

    await callApi(endpoints.orders, {
      method: "POST",
      body: JSON.stringify({
        restaurantId: Number(formData.restaurantId),
        customerName: formData.customerName,
        amount: Number(formData.amount),
      }),
    });

    loadAllData();
  };

  const submitPayment = async (formData) => {
    if (!formData.orderId || !formData.amount || !formData.status) {
      setError("Please fill in all payment fields.");
      return;
    }

    await callApi(endpoints.payments, {
      method: "POST",
      body: JSON.stringify({
        orderId: Number(formData.orderId),
        amount: Number(formData.amount),
        status: formData.status,
      }),
    });

    loadAllData();
  };

  const deleteRestaurant = async (id) => {
    await callApi(`${endpoints.restaurants}/${id}`, { method: "DELETE" });
    loadAllData();
  };

  const deleteOrder = async (id) => {
    await callApi(`${endpoints.orders}/${id}`, { method: "DELETE" });
    loadAllData();
  };

  // Reverse data to show newest first
  const reversedRestaurants = [...restaurants].reverse();
  const reversedOrders = [...orders].reverse();
  const reversedPayments = [...payments].reverse();
  const reversedLogs = [...logs].reverse();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">TableTrack</h1>
          <p className="app-subtitle">Restaurant Management Dashboard</p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          title="Toggle theme"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>

      <div className="container">
        <SummaryCards restaurants={restaurants} orders={orders} payments={payments} />

        {error && (
          <div className="notification error">
            <strong>Error</strong>
            <p>{error}</p>
            <button className="notification-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        <nav className="tabs">
          {[
            { id: "restaurants", label: "Restaurants" },
            { id: "orders", label: "Orders" },
            { id: "payments", label: "Payments" },
            { id: "logs", label: "Audit Logs" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Restaurants Section */}
        {activeTab === "restaurants" && (
          <div className="section">
            <div className="section-layout">
              <FormCard
                title="Add New Restaurant"
                onSubmit={submitRestaurant}
                fields={[
                  { name: "name", label: "Restaurant Name", placeholder: "Enter name", required: true },
                  { name: "address", label: "Address", placeholder: "Enter address", required: true },
                  { name: "cuisine", label: "Cuisine Type", placeholder: "Enter cuisine", required: true },
                ]}
                isLoading={loading}
              />

              <div className="section-content">
                <div className="content-header">
                  <h2>Restaurants</h2>
                  <button className="btn-refresh" onClick={loadAllData} title="Refresh">
                    Refresh
                  </button>
                </div>

                <TableContainer
                  title="Restaurants List"
                  columns={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Name" },
                    { key: "address", label: "Address" },
                    { key: "cuisine", label: "Cuisine" },
                  ]}
                  data={reversedRestaurants}
                  searchFields={["name", "address", "cuisine"]}
                  onDelete={deleteRestaurant}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="section">
            <div className="section-layout">
              <FormCard
                title="Add New Order"
                onSubmit={submitOrder}
                fields={[
                  {
                    name: "restaurantId",
                    label: "Restaurant",
                    type: "select",
                    required: true,
                    options: restaurants.map((r) => ({ value: r.id, label: r.name })),
                  },
                  { name: "customerName", label: "Customer Name", placeholder: "Enter name", required: true },
                  { name: "amount", label: "Amount", type: "number", placeholder: "0.00", required: true },
                ]}
                isLoading={loading}
              />

              <div className="section-content">
                <div className="content-header">
                  <h2>Orders</h2>
                  <button className="btn-refresh" onClick={loadAllData} title="Refresh">
                    Refresh
                  </button>
                </div>

                <TableContainer
                  title="Orders List"
                  columns={[
                    { key: "id", label: "Order ID" },
                    { key: "customerName", label: "Customer" },
                    { key: "restaurantId", label: "Restaurant ID" },
                    {
                      key: "amount",
                      label: "Amount",
                      render: (val) => `₹${Number(val).toFixed(2)}`,
                    },
                  ]}
                  data={reversedOrders}
                  searchFields={["customerName"]}
                  onDelete={deleteOrder}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payments Section */}
        {activeTab === "payments" && (
          <div className="section">
            <div className="section-layout">
              <FormCard
                title="Add Payment"
                onSubmit={submitPayment}
                fields={[
                  {
                    name: "orderId",
                    label: "Order",
                    type: "select",
                    required: true,
                    options: orders.map((o) => ({ value: o.id, label: `#${o.id} - ${o.customerName}` })),
                  },
                  { name: "amount", label: "Amount", type: "number", placeholder: "0.00", required: true },
                  {
                    name: "status",
                    label: "Status",
                    type: "select",
                    required: true,
                    value: "PAID",
                    options: [
                      { value: "PAID", label: "Paid" },
                      { value: "PENDING", label: "Pending" },
                      { value: "FAILED", label: "Failed" },
                    ],
                  },
                ]}
                isLoading={loading}
              />

              <div className="section-content">
                <div className="content-header">
                  <h2>Payments</h2>
                  <button className="btn-refresh" onClick={loadAllData} title="Refresh">
                    Refresh
                  </button>
                </div>

                <TableContainer
                  title="Payments List"
                  columns={[
                    { key: "id", label: "Payment ID" },
                    { key: "orderId", label: "Order ID" },
                    {
                      key: "amount",
                      label: "Amount",
                      render: (val) => `₹${Number(val).toFixed(2)}`,
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (val) => (
                        <span className={`badge status-${String(val).toLowerCase()}`}>{val}</span>
                      ),
                    },
                  ]}
                  data={reversedPayments}
                  searchFields={["status"]}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Section */}
        {activeTab === "logs" && (
          <div className="section">
            <div className="section-content full-width">
              <div className="content-header">
                <h2>Audit Logs</h2>
                <button className="btn-refresh" onClick={loadAllData} title="Refresh">
                  Refresh
                </button>
              </div>

              <TableContainer
                title="Audit Logs"
                columns={[
                  { key: "id", label: "ID" },
                  { key: "serviceName", label: "Service" },
                  {
                    key: "action",
                    label: "Action",
                    render: (val) => <span className={`badge ${getActionColor(val)}`}>{val}</span>,
                  },
                  { key: "entityName", label: "Entity" },
                  { key: "username", label: "User" },
                  { key: "description", label: "Description" },
                  {
                    key: "timestamp",
                    label: "Timestamp",
                    render: (val) => formatTimestamp(val),
                  },
                ]}
                data={reversedLogs}
                searchFields={["serviceName", "action", "entityName", "username"]}
                isLoading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
