import { ApiError, ApiResponse } from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import { nullCheckForUser } from "@user/index";
import { createSellerReviewSchema, updateSellerReviewSchema } from "@seller-review/validations/seller-review.validations";

export const createSellerReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const validate = createSellerReviewSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { seller_id, rating, comment } = validate.data;

    // Check if seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: seller_id },
    });

    if (!seller) {
      const apiError = new ApiError("Seller not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reviewer has seller profile
    const reviewer = await prisma.seller.findUnique({
      where: { id: req.user.id },
    });

    if (!reviewer) {
      const apiError = new ApiError("You must be a seller to create reviews", 403);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if review already exists
    const existingReview = await prisma.sellerReview.findFirst({
      where: {
        seller_id,
        reviewer_id: req.user.id,
      },
    });

    if (existingReview) {
      const apiError = new ApiError("You have already reviewed this seller", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const review = await prisma.sellerReview.create({
      data: {
        seller_id,
        reviewer_id: req.user.id,
        rating,
        comment: comment || null,
      },
      include: {
        profiles_seller_reviews_reviewer_idToprofiles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return reply.status(200).send(ApiResponse.success("Seller review created", review));
  } catch (error) {
    console.log("error creating seller review", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getSellerReviews = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { seller_id } = req.params as { seller_id: string };

    if (!seller_id) {
      const apiError = new ApiError("Seller ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const reviews = await prisma.sellerReview.findMany({
      where: { seller_id },
      include: {
        profiles_seller_reviews_reviewer_idToprofiles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return reply.status(200).send(ApiResponse.success("Seller reviews fetched", reviews));
  } catch (error) {
    console.log("error getting seller reviews", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const updateSellerReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    const existingReview = await prisma.sellerReview.findFirst({
      where: {
        id,
        reviewer_id: req.user.id,
      },
    });

    if (!existingReview) {
      const apiError = new ApiError("Review not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = updateSellerReviewSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const updateData: any = {};
    const data = validate.data;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;
    updateData.updated_at = new Date();

    const updatedReview = await prisma.sellerReview.update({
      where: { id },
      data: updateData,
      include: {
        profiles_seller_reviews_reviewer_idToprofiles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return reply.status(200).send(ApiResponse.success("Seller review updated", updatedReview));
  } catch (error) {
    console.log("error updating seller review", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const deleteSellerReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    const existingReview = await prisma.sellerReview.findFirst({
      where: {
        id,
        reviewer_id: req.user.id,
      },
    });

    if (!existingReview) {
      const apiError = new ApiError("Review not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    await prisma.sellerReview.delete({
      where: { id },
    });

    return reply.status(200).send(ApiResponse.success("Seller review deleted"));
  } catch (error) {
    console.log("error deleting seller review", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

