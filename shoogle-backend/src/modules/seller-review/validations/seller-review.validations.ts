import z from "zod/v4";

export const createSellerReviewSchema = z.object({
  seller_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export const updateSellerReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional().nullable(),
});

