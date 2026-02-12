import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => {
  return res.json({ test: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api", skillRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` SkillSync Backend running on port ${PORT}`)
);
