import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ background: "#111827", padding: "10px" }}>
      <Link to="/" style={linkStyle}>Dashboard</Link>
      <Link to="/employees" style={linkStyle}>Employees</Link>
      <Link to="/attendance" style={linkStyle}>Attendance</Link>

      <button onClick={handleLogout} style={logoutStyle}>
        Logout
      </button>
    </div>
  );
}

const linkStyle = {
  color: "white",
  marginRight: "15px",
  textDecoration: "none",
};

const logoutStyle = {
  float: "right",
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
};

export default Navbar;
