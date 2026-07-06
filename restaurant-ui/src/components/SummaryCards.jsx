const cards = [
  {
    key: "restaurants",
    label: "Total Restaurants",
    getValue: ({ restaurants }) => restaurants.length,
  },
  {
    key: "orders",
    label: "Total Orders",
    getValue: ({ orders }) => orders.length,
  },
  {
    key: "payments",
    label: "Payments",
    getValue: ({ payments }) => payments.length,
  },
  {
    key: "revenue",
    label: "Total Revenue",
    getValue: ({ payments }) => {
      const total = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      return `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
  },
];

export function SummaryCards({ restaurants, orders, payments }) {
  const data = { restaurants, orders, payments };

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div className="summary-card" key={card.key}>
          <span className="summary-label">{card.label}</span>
          <strong className="summary-value">{card.getValue(data)}</strong>
        </div>
      ))}
    </div>
  );
}