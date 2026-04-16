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
        <h1 style={styles.title}>SkillSync</h1>
        <p style={styles.subtitle}>Create your account</p>

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
            {loading ? "Creating account..." : "Register"}
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
    background: "#f4f4f5",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #e4e4e7",
  },
  title: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "4px" },
  subtitle: { color: "#71717a", marginBottom: "1.5rem", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d4d4d8",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    padding: "10px",
    background: "#534AB7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    marginTop: "4px",
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
};

export default RegisterPage;
