export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("ERROR:", err);

  // specific Prisma errors
  if (err.code === "P2002") {
    return res
      .status(400)
      .json({ status: "fail", message: "Duplicate field value entered" });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
