import { z } from "zod";

export const requestTradeSchema = z.object({
  skillId: z.uuid("Invalid skill ID format"),
  providerId: z.uuid("Invalid provider ID format"),
});

export const updateTradeStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"], {
    errorMap: () => ({
      message: "Status must be ACCEPTED, REJECTED, or COMPLETED",
    }),
  }),
});
