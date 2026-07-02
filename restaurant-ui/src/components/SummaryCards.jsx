export function SummaryCards({ restaurants, orders, payments }) {
  const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span className="summary-label">Total Restaurants</span>
        <strong className="summary-value">{restaurants.length}</strong>
      </div>
      <div className="summary-card">
        <span className="summary-label">Total Orders</span>
        <strong className="summary-value">{orders.length}</strong>
      </div>
      <div className="summary-card">
        <span className="summary-label">Payments</span>
        <strong className="summary-value">{payments.length}</strong>
      </div>
      <div className="summary-card">
        <span className="summary-label">Total Revenue</span>
        <strong className="summary-value">₹{totalRevenue.toFixed(2)}</strong>
      </div>
    </div>
  );
}
