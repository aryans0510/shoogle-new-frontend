import { ApiError, ApiResponse } from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import { nullCheckForUser } from "@user/index";
import {
  createReviewSchema,
  updateReviewSchema,
  createReviewReplySchema,
  updateReviewReplySchema,
} from "@review/validations/review.validations";

export const createReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const validate = createReviewSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { listing_id, rating, comment, category } = validate.data;

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listing_id },
    });

    if (!listing) {
      const apiError = new ApiError("Listing not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if user is trying to review their own listing
    if (listing.user_id === req.user.id) {
      const apiError = new ApiError("You cannot review your own listing", 403);
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
    const existingReview = await prisma.review.findFirst({
      where: {
        listing_id,
        buyer_id: req.user.id,
      },
    });

    if (existingReview) {
      const apiError = new ApiError("You have already reviewed this listing", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        listing_id,
        buyer_id: req.user.id,
        rating,
        comment: comment || null,
        category: category || null,
      },
      include: {
        seller_profile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        listings: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update listing review count and average rating
    const listingReviews = await prisma.review.findMany({
      where: { listing_id },
      select: { rating: true },
    });

    const reviewCount = listingReviews.length;
    const averageRating =
      listingReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    await prisma.listing.update({
      where: { id: listing_id },
      data: {
        review_count: reviewCount,
        average_rating: averageRating,
      },
    });

    return reply.status(200).send(ApiResponse.success("Review created successfully", review));
  } catch (error: any) {
    console.log("error creating review", error);
    
    // Handle foreign key constraint errors specifically
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      const apiError = new ApiError("Unable to create review. Please ensure your profile is complete.", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const updateReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Review ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        buyer_id: req.user.id,
      },
    });

    if (!existingReview) {
      const apiError = new ApiError("Review not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = updateReviewSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const updateData: any = {};
    const data = validate.data;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.category !== undefined) updateData.category = data.category;
    updateData.updated_at = new Date();

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        seller_profile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        listings: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update listing average rating
    const listingReviews = await prisma.review.findMany({
      where: { listing_id: existingReview.listing_id },
      select: { rating: true },
    });

    const reviewCount = listingReviews.length;
    const averageRating =
      listingReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    await prisma.listing.update({
      where: { id: existingReview.listing_id },
      data: {
        review_count: reviewCount,
        average_rating: averageRating,
      },
    });

    return reply.status(200).send(ApiResponse.success("Review updated successfully", updatedReview));
  } catch (error: any) {
    console.log("error updating review", error);
    
    // Handle foreign key constraint errors specifically
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      const apiError = new ApiError("Unable to update review. Please ensure your profile is complete.", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const deleteReview = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Review ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        buyer_id: req.user.id,
      },
    });

    if (!existingReview) {
      const apiError = new ApiError("Review not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const listingId = existingReview.listing_id;

    await prisma.review.delete({
      where: { id },
    });

    // Update listing review count and average rating
    const listingReviews = await prisma.review.findMany({
      where: { listing_id: listingId },
      select: { rating: true },
    });

    const reviewCount = listingReviews.length;
    const averageRating =
      reviewCount > 0
        ? listingReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        review_count: reviewCount,
        average_rating: averageRating,
      },
    });

    return reply.status(200).send(ApiResponse.success("Review deleted successfully"));
  } catch (error) {
    console.log("error deleting review", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getReviewsByListing = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { listing_id } = req.params as { listing_id: string };

    if (!listing_id) {
      const apiError = new ApiError("Listing ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const reviews = await prisma.review.findMany({
      where: { listing_id },
      include: {
        seller_profile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        review_replies: {
          include: {
            seller_profile: {
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
            created_at: "asc",
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return reply.status(200).send(ApiResponse.success("Reviews fetched", reviews));
  } catch (error) {
    console.log("error getting reviews", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const createReviewReply = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const validate = createReviewReplySchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { review_id, reply: replyText } = validate.data;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: review_id },
      include: {
        listings: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!review) {
      const apiError = new ApiError("Review not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if user is the seller who owns the listing
    const listing = await prisma.listing.findUnique({
      where: { id: review.listing_id },
      select: { user_id: true },
    });

    if (!listing || listing.user_id !== req.user.id) {
      const apiError = new ApiError("Unauthorized to reply to this review", 403);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if seller profile exists
    const seller = await prisma.seller.findUnique({
      where: { id: req.user.id },
    });

    if (!seller) {
      const apiError = new ApiError("Seller profile not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reply already exists
    const existingReply = await prisma.reviewReply.findFirst({
      where: {
        review_id,
        seller_id: req.user.id,
      },
    });

    if (existingReply) {
      const apiError = new ApiError("You have already replied to this review", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const reviewReply = await prisma.reviewReply.create({
      data: {
        review_id,
        seller_id: req.user.id,
        reply: replyText,
      },
      include: {
        seller_profile: {
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

    return reply.status(200).send(ApiResponse.success("Review reply created", reviewReply));
  } catch (error) {
    console.log("error creating review reply", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const updateReviewReply = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Review reply ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reply exists and belongs to user
    const existingReply = await prisma.reviewReply.findFirst({
      where: {
        id,
        seller_id: req.user.id,
      },
    });

    if (!existingReply) {
      const apiError = new ApiError("Review reply not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = updateReviewReplySchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const updatedReply = await prisma.reviewReply.update({
      where: { id },
      data: {
        reply: validate.data.reply,
        updated_at: new Date(),
      },
      include: {
        seller_profile: {
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

    return reply.status(200).send(ApiResponse.success("Review reply updated", updatedReply));
  } catch (error) {
    console.log("error updating review reply", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const deleteReviewReply = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Review reply ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if reply exists and belongs to user
    const existingReply = await prisma.reviewReply.findFirst({
      where: {
        id,
        seller_id: req.user.id,
      },
    });

    if (!existingReply) {
      const apiError = new ApiError("Review reply not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    await prisma.reviewReply.delete({
      where: { id },
    });

    return reply.status(200).send(ApiResponse.success("Review reply deleted"));
  } catch (error) {
    console.log("error deleting review reply", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

