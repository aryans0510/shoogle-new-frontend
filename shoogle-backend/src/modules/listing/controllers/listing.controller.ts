import { ApiError, ApiResponse } from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import {
  createListingSchema,
  updateListingSchema,
  getListingsQuerySchema,
  generateListingUrlSchema,
  generateSignedUrlForListingImage,
} from "@listing/index";
import { nullCheckForUser } from "@user/index";

export const getUserListings = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const listings = await prisma.listing.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return reply.status(200).send(ApiResponse.success("Listings fetched", listings));
  } catch (error) {
    console.log("error getting listings", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getListingById = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Listing ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reviews: {
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
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!listing) {
      const apiError = new ApiError("Listing not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    return reply.status(200).send(ApiResponse.success("Listing found", listing));
  } catch (error) {
    console.log("error getting listing", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getListings = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validate = getListingsQuerySchema.safeParse(req.query);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { category, search, minPrice, maxPrice, availability, limit, offset, visible_in_discovery } =
      validate.data;

    const where: any = {};

    if (category) where.category = category;
    if (availability) where.availability = availability;
    if (visible_in_discovery !== undefined) where.visible_in_discovery = visible_in_discovery;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.listing.count({ where }),
    ]);

    return reply.status(200).send(
      ApiResponse.success("Listings fetched", {
        listings,
        total,
        limit,
        offset,
      })
    );
  } catch (error) {
    console.log("error getting listings", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const createListing = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const validate = createListingSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const { title, description, availability, location, category, price, tags, media_urls } =
      validate.data;

    // check user is seller
    const checkSeller = await prisma.seller.findFirst({
      where: {
        id: req.user.id,
      },
      select: {
        subscription_plan: true,
      },
    });
    if (!checkSeller) {
      const apiError = new ApiError("User must be a Seller to create listings", 403);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // check free tier limit
    const existingListing = await prisma.listing.findFirst({
      where: {
        user_id: req.user.id,
      },
    });

    if (checkSeller.subscription_plan === "free" && existingListing) {
      const apiError = new ApiError("Free Tier Limit exceeded", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const listing = await prisma.listing.create({
      data: {
        user_id: req.user.id,
        title,
        description: description || null,
        availability,
        category,
        price: price || null,
        tags: tags || [],
        location: location || null,
        media_urls: media_urls || [],
        visible_in_discovery: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return reply.status(200).send(ApiResponse.success("Listing created successfully", listing));
  } catch (error) {
    console.log("error creating listings", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const updateListing = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Listing ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findFirst({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!existingListing) {
      const apiError = new ApiError("Listing not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = updateListingSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const updateData: any = {};
    const data = validate.data;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.availability !== undefined) updateData.availability = data.availability;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.media_urls !== undefined) updateData.media_urls = data.media_urls;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.visible_in_discovery !== undefined)
      updateData.visible_in_discovery = data.visible_in_discovery;

    updateData.updated_at = new Date();

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return reply.status(200).send(ApiResponse.success("Listing updated successfully", updatedListing));
  } catch (error) {
    console.log("error updating listing", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const deleteListing = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const { id } = req.params as { id: string };

    if (!id) {
      const apiError = new ApiError("Listing ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findFirst({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!existingListing) {
      const apiError = new ApiError("Listing not found or unauthorized", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    await prisma.listing.delete({
      where: { id },
    });

    return reply.status(200).send(ApiResponse.success("Listing deleted successfully"));
  } catch (error) {
    console.log("error deleting listing", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const generateS3UrlForListingImageUpload = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    nullCheckForUser(req);
    const validate = generateListingUrlSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    let { type } = validate.data;
    if (type === "jpg") {
      type = "jpeg";
    }

    const url = await generateSignedUrlForListingImage(type, req.user.id);
    if (!url) {
      const apiError = new ApiError("Error generating Presigned url");
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    return reply.status(200).send(ApiResponse.success("Put url generated", url));
  } catch (error) {
    console.log("error in uploading to s3", error);
    const apiError = new ApiError("Internal Server Error");
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};
