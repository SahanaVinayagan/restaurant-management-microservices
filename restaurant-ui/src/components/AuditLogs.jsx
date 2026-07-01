import { useEffect, useState } from "react";
import "../App.css";


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

function AuditLogs() {

    const [logs, setLogs] = useState([]);


    useEffect(() => {

        fetch("http://localhost:8085/audit/logs")
            .then(response => response.json())
            .then(data => {
                setLogs(data);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);



    return (

        <div className="audit-container">


            <h2>Audit Logs</h2>


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

                        <td>{log.serviceName}</td>

                        <td>{log.action}</td>

                        <td>{log.entityName}</td>

                        <td>{log.username}</td>

                        <td>{log.description}</td>

                        <td>
                          {formatTimestamp(log.timestamp)}
                        </td>


                    </tr>


                ))


                }


                </tbody>


            </table>


        </div>

    );

}


export default AuditLogs;