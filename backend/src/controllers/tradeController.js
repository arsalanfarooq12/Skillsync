import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { is } from "zod/v4/locales";

// 1. Initiate a Trade Request
export const requestTrade = catchAsync(async (req, res, next) => {
  const { skillId, providerId } = req.body;
  const requesterId = req.user.id;

  if (requesterId === providerId) {
    return next(new AppError("You cannot trade with yourself", 400));
  }

  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
  });

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  if (skill.userId !== providerId) {
    return next(new AppError("Invalid provider for this skill", 400));
  }

  const existingTrade = await prisma.trade.findFirst({
    where: {
      requesterId,
      providerId,
      skillId,
      status: "PENDING",
    },
  });

  if (existingTrade) {
    return next(new AppError("Trade request already exists", 400));
  }

  const trade = await prisma.trade.create({
    data: {
      requesterId,
      providerId,
      skillId,
      status: "PENDING",
    },
  });

  res.status(201).json(trade);
});

// Get All My Trades (Dashboard view)
export const getMyTrades = catchAsync(async (req, res, next) => {
  const trades = await prisma.trade.findMany({
    where: {
      OR: [{ requesterId: req.user.id }, { providerId: req.user.id }],
    },
    include: {
      skill: true,
      provider: { select: { name: true, email: true } },
      requester: { select: { name: true, email: true } },
    },
  });

  res.status(200).json(trades);
});

//  Update Status (Accept/Reject)
export const updateTradeStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const trade = await prisma.trade.findUnique({ where: { id } });

  if (!trade) return next(new AppError("Trade not found", 404));

  if (trade.providerId !== req.user.id) {
    return next(
      new AppError("Only the skill owner can accept or reject this trade", 403)
    );
  }

  const updatedTrade = await prisma.trade.update({
    where: { id },
    data: { status },
  });

  res.status(200).json(updatedTrade);
});

export const deleteTrade = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trade = await prisma.trade.findUnique({
    where: { id },
  });

  if (!trade) {
    return next(new AppError("Trade not found", 404));
  }
  if (trade.status !== "PENDING") {
    return next(new AppError("Only pending trades can be deleted", 400));
  }
  if (trade.requesterId !== userId && trade.providerId !== userId) {
    return next(new AppError("Not authorized to delete this trade", 403));
  }

  await prisma.trade.delete({
    where: { id },
  });

  res.status(200).json({ message: "Trade request deleted successfully" });
});
