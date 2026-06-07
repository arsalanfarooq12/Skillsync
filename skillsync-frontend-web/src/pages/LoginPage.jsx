import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClient";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.user, data.accessToken);
      navigate("/trades");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Skill<span style={{ color: "#A47DAB" }}>Sync</span>
        </h1>

        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.link}>
          No account yet?{" "}
          <Link
            to="/register"
            style={{
              color: "#A47DAB",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#332736", // deep
    backgroundImage: `
      radial-gradient(circle at 80% 20%, rgba(164,125,171,0.18), transparent 35%),
      radial-gradient(circle at 20% 80%, rgba(61,86,47,0.22), transparent 40%)
    `,
    padding: "2rem",
    fontFamily: "'DM Sans', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "rgba(30,24,32,0.95)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(164,125,171,0.25)",
    borderRadius: "24px",
    padding: "2.5rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#F5F2E8",
    textAlign: "center",
    marginBottom: "0.4rem",
    letterSpacing: "-1px",
    fontFamily: "'Syne', sans-serif",
  },

  subtitle: {
    color: "rgba(245,242,232,0.65)",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(164,125,171,0.2)",
    background: "rgba(245,242,232,0.05)",
    color: "#F5F2E8",
    fontSize: "0.95rem",
    outline: "none",
  },

  button: {
    padding: "14px",
    marginTop: "8px",
    borderRadius: "50px",
    border: "none",
    background: "#A47DAB",
    color: "#332736",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all .2s ease",
  },

  error: {
    background: "rgba(220,38,38,0.15)",
    border: "1px solid rgba(220,38,38,0.3)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },

  link: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "rgba(245,242,232,0.65)",
    fontSize: "0.9rem",
  },
};

export default LoginPage;
