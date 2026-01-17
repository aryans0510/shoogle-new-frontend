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

    // Check if user is trying to review themselves
    if (seller.id === req.user.id) {
      const apiError = new ApiError("You cannot review yourself", 403);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reviewer exists (required for foreign key constraint)
    const reviewer = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!reviewer) {
      const apiError = new ApiError("User not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Ensure user has a seller profile (required for foreign key constraint)
    let reviewerProfile = await prisma.seller.findUnique({
      where: { id: req.user.id },
    });

    if (!reviewerProfile) {
      // Create a basic seller profile for the user
      reviewerProfile = await prisma.seller.create({
        data: {
          id: req.user.id,
          business_name: reviewer.name,
        },
      });
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
    });

    // Fetch the created review with relationships
    const reviewWithRelations = await prisma.sellerReview.findUnique({
      where: { id: review.id },
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

    return reply.status(200).send(ApiResponse.success("Seller review created", reviewWithRelations || review));
  } catch (error: any) {
    console.log("error creating seller review", error);
    
    // Handle foreign key constraint errors specifically
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      const apiError = new ApiError("Unable to create review. Please ensure your profile is complete.", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    
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
  } catch (error: any) {
    console.log("error updating seller review", error);
    
    // Handle foreign key constraint errors specifically
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      const apiError = new ApiError("Unable to update review. Please ensure your profile is complete.", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    
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

