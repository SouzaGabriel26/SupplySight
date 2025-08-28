import { z } from "zod";

export const updateDemandSchema = z.object({
  demand: z
    .number()
    .min(0, "Demand must be a positive number")
    .max(10000, "Demand cannot exceed 10,000"),
});

export const transferStockSchema = z.object({
  from: z.string().min(1, "Please select a source warehouse"),
  to: z.string().min(1, "Please select a destination warehouse"),
  qty: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(10000, "Quantity cannot exceed 10,000"),
});

export type UpdateDemandFormData = z.infer<typeof updateDemandSchema>;
export type TransferStockFormData = z.infer<typeof transferStockSchema>;
