import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  requestTrade,
  getMyTrades,
  updateTradeStatus,
} from "../controllers/tradeController.js";

const router = express.Router();

router.use(protect);

router.post("/request", requestTrade);
router.get("/my-trades", getMyTrades);
router.patch("/:id/status", updateTradeStatus);

export default router;
