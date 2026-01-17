import { ApiError, ApiResponse } from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import { nullCheckForUser } from "@user/index";
import { createReactionSchema } from "@reaction/validations/reaction.validations";

export const toggleReaction = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const validate = createReactionSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { listing_id, reaction_type } = validate.data;

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listing_id },
    });

    if (!listing) {
      const apiError = new ApiError("Listing not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reaction already exists
    const existingReaction = await prisma.listingReaction.findFirst({
      where: {
        user_id: req.user.id,
        listing_id,
      },
    });

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        // Remove reaction if same type
        await prisma.listingReaction.delete({
          where: {
            id: existingReaction.id,
          },
        });

        // Update listing counts
        const updateField = reaction_type === "like" ? "like_count" : "dislike_count";
        await prisma.listing.update({
          where: { id: listing_id },
          data: {
            [updateField]: {
              decrement: 1,
            },
          },
        });

        return reply.status(200).send(ApiResponse.success("Reaction removed"));
      } else {
        // Update reaction type
        await prisma.listingReaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            reaction_type,
            updated_at: new Date(),
          },
        });

        // Update listing counts
        const oldField = existingReaction.reaction_type === "like" ? "like_count" : "dislike_count";
        const newField = reaction_type === "like" ? "like_count" : "dislike_count";

        await prisma.listing.update({
          where: { id: listing_id },
          data: {
            [oldField]: {
              decrement: 1,
            },
            [newField]: {
              increment: 1,
            },
          },
        });

        return reply.status(200).send(ApiResponse.success("Reaction updated"));
      }
    } else {
      // Create new reaction
      await prisma.listingReaction.create({
        data: {
          user_id: req.user.id,
          listing_id,
          reaction_type,
        },
      });

      // Update listing counts
      const updateField = reaction_type === "like" ? "like_count" : "dislike_count";
      await prisma.listing.update({
        where: { id: listing_id },
        data: {
          [updateField]: {
            increment: 1,
          },
        },
      });

      return reply.status(200).send(ApiResponse.success("Reaction created"));
    }
  } catch (error) {
    console.log("error toggling reaction", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getUserReaction = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { listing_id } = req.params as { listing_id: string };

    if (!listing_id) {
      const apiError = new ApiError("Listing ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const reaction = await prisma.listingReaction.findFirst({
      where: {
        user_id: req.user.id,
        listing_id,
      },
    });

    return reply.status(200).send(
      ApiResponse.success("User reaction fetched", {
        reaction_type: reaction?.reaction_type || null,
      })
    );
  } catch (error) {
    console.log("error getting user reaction", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

