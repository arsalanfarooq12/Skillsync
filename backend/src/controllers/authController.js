import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";
import { generateTokens } from "../utils/generateToken.js";
import catchAsync from "../utils/catchAsync.js";
const JWT_SECRET = process.env.JWT_SECRET;

export const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(new AppError("Email already in use", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError("Invalid Credentials", 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid Credentials", 400));
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only over HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("No refresh token found", 401));
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) return next(new AppError("User no longer exists", 401));

  const tokens = generateTokens(user.id);

  res.status(200).json({
    accessToken: tokens.accessToken,
  });
});

export const logout = catchAsync(async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});
