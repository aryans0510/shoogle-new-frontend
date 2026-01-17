import z from "zod/v4";

export const createReviewSchema = z.object({
  listing_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const createReviewReplySchema = z.object({
  review_id: z.string().uuid(),
  reply: z.string().min(1),
});

export const updateReviewReplySchema = z.object({
  reply: z.string().min(1),
});

