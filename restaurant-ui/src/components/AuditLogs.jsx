import { useEffect, useState } from "react";
import "../App.css";
import { formatTimestamp, getActionColor } from "../utils/helpers";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/logs")
      .then((response) => response.json())
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="audit-panel">
      <div className="panel-header">
        <h2>Audit Logs</h2>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <p>No audit logs found</p>
        </div>
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
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.serviceName}</td>
                  <td>
                    <span className={`tag ${getActionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td>{log.entityName}</td>
                  <td>{log.username}</td>
                  <td>{log.description}</td>
                  <td>{formatTimestamp(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;