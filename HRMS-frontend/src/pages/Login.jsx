import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Invalid username or password");
        return;
      }

      const data = await res.json();

      // 🔐 Save JWT token
      localStorage.setItem("token", data.access_token);

      // 🚀 Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        height: "100vh",
        backgroundColor: "#111827",
        color: "white",
      }}
    >
      <h1>HRMS Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          marginTop: "30px",
          display: "inline-block",
          padding: "25px",
          backgroundColor: "#1f2937",
          borderRadius: "10px",
        }}
      >
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "10px",
            width: "220px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "none",
          }}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            width: "220px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "none",
          }}
        />
        <br />

        <button
          type="submit"
          style={{
            padding: "10px 25px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
