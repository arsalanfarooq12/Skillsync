import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClient";

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const { data } = await api.post("/auth/register", formData);
      login(data.user, data.accessToken);
      navigate("/trades");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
        <p style={styles.subtitle}>
          Join thousands of learners sharing skills and growing together.
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            {loading ? "Creating Account..." : "Create Free Account →"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
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
  subtitle: { color: "#71717a", marginBottom: "1.5rem", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(164,125,171,.2)",
    background: "rgba(245,242,232,.05)",
    color: "#F5F2E8",
  },
  button: {
    padding: "14px",
    borderRadius: "999px",
    background: "#A47DAB",
    color: "#332736",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  link: {
    marginTop: "1.25rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#71717a",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "1.5rem",
    color: "#332736",
    fontSize: "0.9rem",
  },
};

export default RegisterPage;
