import { useEffect, useState } from "react";
import { authFetch } from "../api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 LOAD EMPLOYEES (with JWT)
  const loadEmployees = () => {
    authFetch("/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // 🔹 ADD or UPDATE EMPLOYEE
  const addEmployee = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await authFetch(`/employees/${editId}`, {
        method: "PUT",
        body: JSON.stringify({
          employee_id: editId,
          name,
          email,
          department,
        }),
      });

      setIsEditing(false);
      setEditId(null);
    } else {
      await authFetch("/employees", {
        method: "POST",
        body: JSON.stringify({
          employee_id: employeeId,
          name,
          email,
          department,
        }),
      });
    }

    setEmployeeId("");
    setName("");
    setEmail("");
    setDepartment("");
    loadEmployees();
  };

  // 🔹 START EDIT
  const startEdit = (emp) => {
    setIsEditing(true);
    setEditId(emp.employee_id);
    setEmployeeId(emp.employee_id);
    setName(emp.name);
    setEmail(emp.email);
    setDepartment(emp.department);
  };

  // 🔹 DELETE
  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    await authFetch(`/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  };

  return (
    <div>
      <h1>Employees</h1>

      {/* FORM */}
      <form onSubmit={addEmployee}>
        <input
          placeholder="ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          disabled={isEditing}
          required
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Dept"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>

      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button onClick={() => startEdit(emp)}>Edit</button>{" "}
                <button onClick={() => deleteEmployee(emp.employee_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
