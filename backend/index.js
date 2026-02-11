import express, { json } from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
