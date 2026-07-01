import { useEffect, useState } from "react";
import "./App.css";

const endpoints = {
  restaurants: "/restaurants",
  orders: "/orders",
  payments: "/payments",
  logs: "/logs",
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const value = String(timestamp).trim();
  const bareIso = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.[0-9]+)?$/;
  const offsetIso = /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?)(Z|[+-][0-9]{2}:[0-9]{2})$/;
  let date;

  if (offsetIso.test(value)) {
    date = new Date(value);
  } else {
    const match = bareIso.exec(value);
    date = match
      ? new Date(Date.UTC(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ))
      : new Date(value);
  }

  if (Number.isNaN(date.getTime())) return value;
  const pad = (v) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

function App() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    address: "",
    cuisine: "",
  });

  const [orderForm, setOrderForm] = useState({
    restaurantId: "",
    customerName: "",
    amount: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    orderId: "",
    amount: "",
    status: "PAID",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("tabletrack-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("tabletrack-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadRestaurants();
    loadOrders();
    loadPayments();
    loadLogs();
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
      if (!text) {
        return null;
      }

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

  const loadRestaurants = async () => {
    const result = await callApi(endpoints.restaurants);
    if (result) setRestaurants(result);
  };

  const loadOrders = async () => {
    const result = await callApi(endpoints.orders);
    if (result) setOrders(result);
  };

  const loadPayments = async () => {
    const result = await callApi(endpoints.payments);
    if (result) setPayments(result);
  };

  const loadLogs = async () => {
  const result = await callApi(endpoints.logs);

  console.log("Audit Logs Response:", result);

  if (Array.isArray(result)) {
    setLogs(result);
  } else {
    setLogs([]);
  }
};

  const loadData = () => {

  if(activeTab === "restaurants")
    return loadRestaurants();

  if(activeTab === "orders")
    return loadOrders();

  if(activeTab === "payments")
    return loadPayments();

  if(activeTab === "logs")
    return loadLogs();

};

  const submitRestaurant = async () => {
    if (!restaurantForm.name || !restaurantForm.address || !restaurantForm.cuisine) {
      setError("Please fill in all restaurant fields.");
      return;
    }

    await callApi(endpoints.restaurants, {
      method: "POST",
      body: JSON.stringify(restaurantForm),
    });

    setRestaurantForm({ name: "", address: "", cuisine: "" });
    loadRestaurants();
  };

  const submitOrder = async () => {
    if (!orderForm.restaurantId || !orderForm.customerName || !orderForm.amount) {
      setError("Please fill in all order fields.");
      return;
    }

    await callApi(endpoints.orders, {
      method: "POST",
      body: JSON.stringify({
        restaurantId: Number(orderForm.restaurantId),
        customerName: orderForm.customerName,
        amount: Number(orderForm.amount),
      }),
    });

    setOrderForm({ restaurantId: "", customerName: "", amount: "" });
    loadOrders();
  };

  const submitPayment = async () => {
    if (!paymentForm.orderId || !paymentForm.amount || !paymentForm.status) {
      setError("Please fill in all payment fields.");
      return;
    }

    await callApi(endpoints.payments, {
      method: "POST",
      body: JSON.stringify({
        orderId: Number(paymentForm.orderId),
        amount: Number(paymentForm.amount),
        status: paymentForm.status,
      }),
    });

    setPaymentForm({ orderId: "", amount: "", status: "PAID" });
    loadPayments();
  };

  const deleteRestaurant = async (id) => {
    await callApi(`${endpoints.restaurants}/${id}`, { method: "DELETE" });
    loadRestaurants();
  };

  const deleteOrder = async (id) => {
    await callApi(`${endpoints.orders}/${id}`, { method: "DELETE" });
    loadOrders();
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="app-title">TableTrack</h1>
          <p className="header-subtitle">Manage restaurants, orders, and payments in one dashboard</p>
        </div>
        <button type="button" className="secondary-button theme-toggle" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <div className="tabs">
        {[
          { id: "restaurants", label: "Restaurants" },
          { id: "orders", label: "Orders" },
          { id: "payments", label: "Payments" },
          { id: "logs", label: "Audit Logs" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="metric-card">
          <span className="metric-title">Restaurants</span>
          <strong>{restaurants.length}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-title">Orders</span>
          <strong>{orders.length}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-title">Total payments</span>
          <strong>${totalRevenue.toFixed(2)}</strong>
        </article>
      </div>

      {error && (
        <div className="notification error">
          <strong>Error</strong>
          <p>{error}</p>
        </div>
      )}

      {loading && <div className="notification info">Loading…</div>}

      {activeTab === "restaurants" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Restaurants</h2>
              <p>View and add restaurants for your delivery ecosystem.</p>
            </div>
            <button type="button" className="secondary-button" onClick={loadRestaurants}>
              Refresh
            </button>
          </div>

          <div className="panel-grid">
            <div className="form-card">
              <h3>Add new restaurant</h3>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    placeholder="Restaurant name"
                  />
                </label>
                <label>
                  Address
                  <input
                    value={restaurantForm.address}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                    placeholder="Address"
                  />
                </label>
                <label>
                  Cuisine
                  <input
                    value={restaurantForm.cuisine}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
                    placeholder="Cuisine"
                  />
                </label>
              </div>
              <button type="button" onClick={submitRestaurant}>
                Create restaurant
              </button>
            </div>

            <div className="card-grid">
              {restaurants.length === 0 ? (
                <div className="empty-state">No restaurants yet.</div>
              ) : (
                restaurants.map((restaurant) => (
                  <article className="card" key={restaurant.id}>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.address}</p>
                    <p className="tag">{restaurant.cuisine}</p>
                    <button className="danger-button" type="button" onClick={() => deleteRestaurant(restaurant.id)}>
                      Delete restaurant
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Orders</h2>
              <p>Create orders and track customer purchases.</p>
            </div>
            <button type="button" className="secondary-button" onClick={loadOrders}>
              Refresh
            </button>
          </div>

          <div className="panel-grid">
            <div className="form-card">
              <h3>Add new order</h3>
              <div className="form-grid">
                <label>
                  Restaurant
                  <select
                    value={orderForm.restaurantId}
                    onChange={(e) => setOrderForm({ ...orderForm, restaurantId: e.target.value })}
                  >
                    <option value="">Select restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Customer name
                  <input
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    placeholder="Customer name"
                  />
                </label>
                <label>
                  Amount
                  <input
                    type="number"
                    value={orderForm.amount}
                    onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                    placeholder="Order total"
                  />
                </label>
              </div>
              <button type="button" onClick={submitOrder}>
                Place order
              </button>
            </div>

            <div className="card-grid">
              {orders.length === 0 ? (
                <div className="empty-state">No orders yet.</div>
              ) : (
                orders.map((order) => (
                  <article className="card" key={order.id}>
                    <h3>Order #{order.id}</h3>
                    <p>Customer: {order.customerName}</p>
                    <p>Restaurant ID: {order.restaurantId}</p>
                    <p>Amount: ${Number(order.amount).toFixed(2)}</p>
                    <button className="danger-button" type="button" onClick={() => deleteOrder(order.id)}>
                      Delete order
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "payments" && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Payments</h2>
              <p>Record payments for completed orders.</p>
            </div>
            <button type="button" className="secondary-button" onClick={loadPayments}>
              Refresh
            </button>
          </div>

          <div className="panel-grid">
            <div className="form-card">
              <h3>Add payment</h3>
              <div className="form-grid">
                <label>
                  Order
                  <select
                    value={paymentForm.orderId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })}
                  >
                    <option value="">Select order</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #{order.id} - {order.customerName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="Payment amount"
                  />
                </label>
                <label>
                  Status
                  <select value={paymentForm.status} onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}>
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </label>
              </div>
              <button type="button" onClick={submitPayment}>
                Record payment
              </button>
            </div>

            <div className="card-grid">
              {payments.length === 0 ? (
                <div className="empty-state">No payments yet.</div>
              ) : (
                payments.map((payment) => (
                  <article className="card" key={payment.id}>
                    <h3>Payment #{payment.id}</h3>
                    <p>Order ID: {payment.orderId}</p>
                    <p>Amount: ${Number(payment.amount).toFixed(2)}</p>
                    <p className="tag">{payment.status}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "logs" && (
        <section className="panel audit-panel">
          <div className="panel-header">
            <div>
              <h2>Audit Logs</h2>
              <p>Track service activity and events across the platform.</p>
            </div>
            <button className="secondary-button" onClick={loadLogs} type="button">
              Refresh
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="empty-state">No audit logs available</div>
          ) : (
            <div className="table-wrapper">
              <table className="audit-table">

<thead>

<tr>
<th>ID</th>
<th>Service</th>
<th>Action</th>
<th>Entity</th>
<th>User</th>
<th>Description</th>
<th>Time</th>
</tr>

</thead>


<tbody>


{
logs.map((log)=>(

<tr key={log.id}>

<td>{log.id}</td>


<td>
{log.serviceName}
</td>


<td>
<span className="tag">
{log.action}
</span>
</td>


<td>
{log.entityName}
<br/>
#{log.entityId}
</td>


<td>
{log.username}
</td>


<td>
{log.description}
</td>


<td>
{formatTimestamp(log.timestamp)}
</td>


</tr>


))
}


</tbody>

              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
