import z from "zod/v4";

export const createReactionSchema = z.object({
  listing_id: z.string().uuid(),
  reaction_type: z.enum(["like", "dislike"]),
});

