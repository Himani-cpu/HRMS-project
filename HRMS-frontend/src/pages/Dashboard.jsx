import { useEffect, useState } from "react";
import { authFetch } from "../api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    authFetch("/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  return (
    <div>
      <h1>HRMS Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h2 style={{ color: "#111827" }}>Total Employees</h2>
          <p style={{ fontSize: "24px", color: "#111827" }}>
            {employees.length}
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: "#111827" }}>Status</h2>
          <p style={{ color: "green", fontWeight: "bold" }}>
            System Running ✅
          </p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  backgroundColor: "#e5e7eb",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
};

export default Dashboard;
