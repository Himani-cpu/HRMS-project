import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />

        {/* EMPLOYEES */}
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Employees />
              </>
            </PrivateRoute>
          }
        />

        {/* ATTENDANCE */}
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Attendance />
              </>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
