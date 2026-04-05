import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>FlowForge Dashboard</h1>

      <h2>Order Stats</h2>
      {data.orderStats.map((item, i) => (
        <p key={i}>{item.status}: {item.count}</p>
      ))}

      <h2>Delays</h2>
      {data.delayStats.map((item, i) => (
        <p key={i}>
          Dept {item.department_id}: {item.count} delays
        </p>
      ))}

      <h2>Workflow Stats</h2>
      {data.workflowStats.map((item, i) => (
        <p key={i}>{item.status}: {item.count}</p>
      ))}
    </div>
  );
}

export default Dashboard;
