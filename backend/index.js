import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => {
  return res.json({ test: "ok" });
});
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` SkillSync Backend running on port ${PORT}`)
);
