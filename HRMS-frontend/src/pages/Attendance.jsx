import { useState } from "react";
import { authFetch } from "../api";

function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);

  // 🔹 MARK ATTENDANCE (JWT protected)
  const markAttendance = async (e) => {
    e.preventDefault();

    await authFetch("/attendance", {
      method: "POST",
      body: JSON.stringify({
        employee_id: employeeId,
        date,
        status,
      }),
    });

    alert("Attendance marked!");
  };

  // 🔹 LOAD ATTENDANCE (JWT protected)
  const loadAttendance = async () => {
    const res = await authFetch(`/attendance/${employeeId}`);
    const data = await res.json();
    setRecords(data);
  };

  return (
    <div>
      <h1>Attendance</h1>

      {/* FORM */}
      <form onSubmit={markAttendance}>
        <input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Present</option>
          <option>Absent</option>
          <option>Leave</option>
        </select>

        <button type="submit">Mark</button>
        <button type="button" onClick={loadAttendance}>
          View
        </button>
      </form>

      {/* TABLE */}
      {records.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.employee_id}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Attendance;
