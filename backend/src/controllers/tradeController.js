import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { is } from "zod/v4/locales";

// 1. Initiate a Trade Request
export const requestTrade = catchAsync(async (req, res, next) => {
  const { skillId, providerId } = req.body; // Getting the owner and the skill
  const requesterId = req.user.id;

  if (requesterId === providerId) {
    return next(new AppError("You cannot trade with yourself", 400));
  }

  if (await prisma.skill.findUnique({ where: { id: skillId } })) {
    return next(new AppError("Skill already exist", 404));
  }
  const trade = await prisma.trade.create({
    data: {
      requesterId,
      providerId,
      skillId,
      status: "PENDING",
    },
  });

  res.status(201).json({ status: "success", data: trade });
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

  res.status(200).json({ status: "success", data: trades });
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

  res.status(200).json({ status: "success", data: updatedTrade });
});
