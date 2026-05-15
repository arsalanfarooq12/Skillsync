//  this is the dashboard page where users can see their trades, incoming requests,
// and browse skills to request swaps.
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiClient";
import { confirmAction } from "../utils/swal";
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
    if (!user?.id) return;
    fetchData();
  }, [user?.id]);
  // this function fetches both the user's trades and the list of all skills when the component mounts or
  //  when the user changes. It uses Promise.all to make both API calls in parallel, improving performance.
  //  The results are stored in state variables, and any errors are captured and displayed to the user.
  const fetchData = async () => {
    try {
      const [tradesRes, skillsRes] = await Promise.all([
        api.get("/trades/my-trades"),
        api.get("/skills"),
      ]);

      setTrades(tradesRes.data || []);
      setSkills(skillsRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };
  // This function handles the submission of the form to add a new skill.
  //  It sends a POST request to the API with the new skill data, and if successful,
  //  it resets the form and refreshes the data. If there's an error, it captures and displays the error message.
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
  //
  const handleDeleteSkill = async (skillId) => {
    const ok = await confirmAction({
      title: "Delete this skill?",
      text: "This will remove the skill permanently.",
      confirmButtonText: "Delete",
    });
    if (!ok) {
      try {
        await api.delete(`/skills/${skillId}`);
        await fetchData();
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to delete skill"
        );
      }
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
  // Delete a trade request.
  const handleDeleteTrade = async (tradeId) => {
    try {
      await api.delete(`/trades/${tradeId}`);
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete trade"
      );
    }
  };
  //  The component filters the trades into two categories: incomingTrades,
  //  which are pending trade requests where the current user is the provider,
  // and myTrades, which are all trade requests initiated by the current user.
  // This allows the UI to display these two sets of trades separately for better user experience.
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
        {/* {error && <p style={styles.error}>{error}</p>} */}

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
              <select
                style={styles.input}
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill((p) => ({ ...p, category: e.target.value }))
                }
                required
              >
                <option value="">Select category</option>
                <option value="Programming">Programming</option>
                <option value="Music">Music</option>
                <option value="Design">Design</option>
                <option value="Language">Language</option>
                <option value="Other">Other</option>
              </select>
              <button style={styles.button} type="submit">
                Add skill
              </button>
            </form>
          </section>
          <section style={styles.section}>
            <div style={styles.trades}>
              <h2 style={styles.sectionTitle}>Browse skills</h2>

              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div key={skill.id} style={styles.card}>
                    <div>
                      <p style={styles.cardTitle}>{skill.title}</p>
                      <p style={styles.cardSub}>{skill.description}</p>
                      <p style={styles.cardOwner}>by {skill.user?.name}</p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {skill.userId !== user?.id && (
                        <button
                          style={styles.smallBtn}
                          onClick={() =>
                            handleRequestTrade(skill.id, skill.userId)
                          }
                        >
                          Request
                        </button>
                      )}

                      {skill.userId === user?.id && (
                        <button
                          style={{ ...styles.smallBtn, background: "#dc2626" }}
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.empty}>No skills listed yet.</p>
              )}
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Incoming requests</h2>
            {incomingTrades.length === 0 && (
              <p style={styles.empty}>No pending requests.</p>
            )}

            {incomingTrades.map((trade) => (
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

            {myTrades.map((trade) => (
              <div key={trade.id} style={styles.card}>
                <div>
                  <p style={styles.cardTitle}>{trade.skill?.title}</p>
                  <p style={styles.cardSub}>to {trade.provider?.name}</p>
                </div>

                <span style={{ ...styles.badge, ...statusColor(trade.status) }}>
                  {trade.status}
                </span>
                <button onClick={() => handleDeleteTrade(trade.id)}>
                  Delete
                </button>
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
  trades: {
    maxHeight: "60vh",
    overflow: "scroll",
  },

  page: { minHeight: "100vh", background: "#fea49f" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#101357",
    borderBottom: "1px solid #e4e4e7",
    color: "#fff",
  },
  logo: { fontSize: "1.25rem", fontWeight: "700" },
  headerRight: { display: "flex", alignItems: "center", gap: "1rem" },
  userName: { fontSize: "0.9rem", color: "#71717a" },
  logoutBtn: {
    padding: "6px 14px",
    background: "#dc2626",
    color: "#fff",

    border: "1px solid #dc2626",
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
    background: "#fff5d7",
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
