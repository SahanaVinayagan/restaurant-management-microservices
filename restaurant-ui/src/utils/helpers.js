export const formatTimestamp = (timestamp) => {
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

export const getActionColor = (action) => {
  const upper = String(action).toUpperCase();
  if (upper === "CREATE" || upper === "CREATED") return "action-create";
  if (upper === "UPDATE" || upper === "UPDATED") return "action-update";
  if (upper === "DELETE" || upper === "DELETED") return "action-delete";
  return "action-default";
};