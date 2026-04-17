import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClient";

function TradesPage() {
  const { user, logout } = useAuth();

  const [trades, setTrades] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [tradesRes, skillsRes] = await Promise.all([
        api.get("/trades/my-trades"),
        api.get("/skills"),
      ]);

      setTrades(tradesRes.data.data || []);
      setSkills(skillsRes.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post("/skills/add", newSkill);
      setNewSkill({ title: "", description: "", category: "" });
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add skill"
      );
    }
  };

  const handleRequestTrade = async (skillId, providerId) => {
    try {
      await api.post("/trades/request", { skillId, providerId });
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to request trade"
      );
    }
  };

  const handleUpdateStatus = async (tradeId, status) => {
    try {
      await api.patch(`/trades/${tradeId}/status`, { status });
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update trade"
      );
    }
  };

  const incomingTrades = trades.filter(
    (t) => t.providerId === user?.id && t.status === "PENDING"
  );

  const myTrades = trades.filter((t) => t.requesterId === user?.id);

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (!user) return <p style={styles.center}>Please login again.</p>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SkillSync</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hi, {user.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Add a skill</h2>
            <form onSubmit={handleAddSkill} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Skill title"
                value={newSkill.title}
                onChange={(e) =>
                  setNewSkill((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
              <input
                style={styles.input}
                placeholder="Short description"
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill((p) => ({ ...p, description: e.target.value }))
                }
                required
              />
              <input
                style={styles.input}
                placeholder="Category"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill((p) => ({ ...p, category: e.target.value }))
                }
                required
              />
              <button style={styles.button} type="submit">
                Add skill
              </button>
            </form>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Browse skills</h2>
            {skills.length === 0 && (
              <p style={styles.empty}>No skills listed yet.</p>
            )}
            {(skills || []).map((skill) => (
              <div key={skill.id} style={styles.card}>
                <div>
                  <p style={styles.cardTitle}>{skill.title}</p>
                  <p style={styles.cardSub}>{skill.description}</p>
                  <p style={styles.cardOwner}>by {skill.user?.name}</p>
                </div>
                {skill.userId !== user.id && (
                  <button
                    style={styles.smallBtn}
                    onClick={() => handleRequestTrade(skill.id, skill.userId)}
                  >
                    Request swap
                  </button>
                )}
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Incoming requests</h2>
            {incomingTrades.length === 0 && (
              <p style={styles.empty}>No pending requests.</p>
            )}
            {(incomingTrades || []).map((trade) => (
              <div key={trade.id} style={styles.card}>
                <div>
                  <p style={styles.cardTitle}>{trade.skill?.title}</p>
                  <p style={styles.cardSub}>from {trade.requester?.name}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{ ...styles.smallBtn, background: "#16a34a" }}
                    onClick={() => handleUpdateStatus(trade.id, "ACCEPTED")}
                  >
                    Accept
                  </button>
                  <button
                    style={{ ...styles.smallBtn, background: "#dc2626" }}
                    onClick={() => handleUpdateStatus(trade.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>My requests</h2>
            {myTrades.length === 0 && (
              <p style={styles.empty}>No requests sent yet.</p>
            )}
            {(myTrades || []).map((trade) => (
              <div key={trade.id} style={styles.card}>
                <div>
                  <p style={styles.cardTitle}>{trade.skill?.title}</p>
                  <p style={styles.cardSub}>to {trade.provider?.name}</p>
                </div>
                <span style={{ ...styles.badge, ...statusColor(trade.status) }}>
                  {trade.status}
                </span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

const statusColor = (status) => {
  if (status === "ACCEPTED") return { background: "#dcfce7", color: "#15803d" };
  if (status === "REJECTED") return { background: "#fee2e2", color: "#b91c1c" };
  if (status === "COMPLETED")
    return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#fef9c3", color: "#854d0e" };
};

const styles = {
  page: { minHeight: "100vh", background: "#f4f4f5" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#fff",
    borderBottom: "1px solid #e4e4e7",
  },
  logo: { fontSize: "1.25rem", fontWeight: "700" },
  headerRight: { display: "flex", alignItems: "center", gap: "1rem" },
  userName: { fontSize: "0.9rem", color: "#71717a" },
  logoutBtn: {
    padding: "6px 14px",
    background: "transparent",
    border: "1px solid #d4d4d8",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.25rem",
    border: "1px solid #e4e4e7",
  },
  sectionTitle: { fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  input: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #d4d4d8",
    fontSize: "0.9rem",
    outline: "none",
  },
  button: {
    padding: "8px",
    background: "#534AB7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f4f4f5",
  },
  cardTitle: { fontSize: "0.9rem", fontWeight: "500" },
  cardSub: { fontSize: "0.8rem", color: "#71717a" },
  cardOwner: { fontSize: "0.75rem", color: "#a1a1aa", marginTop: "2px" },
  smallBtn: {
    padding: "4px 10px",
    background: "#534AB7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  empty: { fontSize: "0.875rem", color: "#a1a1aa" },
  center: { textAlign: "center", marginTop: "4rem", color: "#71717a" },
};

export default TradesPage;
