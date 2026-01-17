import { ApiError, ApiResponse } from "@shared/index";
import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import { nullCheckForUser } from "@user/index";
import {
  createSellerProfileSchema,
  updateSellerProfileSchema,
  validatePhoneNumber,
} from "@user/validations/seller.validations";

export const getSellerProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const seller = await prisma.seller.findFirst({
      where: { id: req.user.id },
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

    if (!seller) {
      return reply.status(200).send(ApiResponse.success("Seller onboarding incomplete", null));
    }

    return reply.status(200).send(ApiResponse.success("Seller profile found", seller));
  } catch (error) {
    console.log("Error fetching profiles", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const getSellerProfileById = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { seller_id } = req.params as { seller_id: string };

    if (!seller_id) {
      const apiError = new ApiError("Seller ID is required", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const seller = await prisma.seller.findUnique({
      where: { id: seller_id },
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

    if (!seller) {
      const apiError = new ApiError("Seller profile not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    return reply.status(200).send(ApiResponse.success("Seller profile found", seller));
  } catch (error) {
    console.log("Error fetching seller profile", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const createSellerProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    if (!req.user?.seller) {
      const apiError = new ApiError("Please Login as Seller", 403);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = createSellerProfileSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    const { business_name, whatsapp_number, latitude, longitude, location } = validate.data;

    const isPhoneNumberValid = validatePhoneNumber(whatsapp_number);
    if (!isPhoneNumberValid) {
      const apiError = new ApiError("Invalid Phone number", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const check = await prisma.seller.findFirst({
      where: { id: req.user.id },
    });
    if (check) {
      return reply.status(200).send(ApiResponse.success("Seller Profile already exists", check));
    }

    const seller = await prisma.seller.create({
      data: {
        id: req.user.id,
        business_name,
        whatsapp_number,
        latitude: latitude ? latitude.toString() : null,
        longitude: longitude ? longitude.toString() : null,
        location: location || null,
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

    return reply.status(200).send(ApiResponse.success("Seller Profile created", seller));
  } catch (error) {
    console.log("Error creating seller profile", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const updateSellerProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const seller = await prisma.seller.findFirst({
      where: { id: req.user.id },
    });

    if (!seller) {
      const apiError = new ApiError("Seller profile not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validate = updateSellerProfileSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const data = validate.data;
    if (data.whatsapp_number) {
      // If it's a URL/link, skip phone validation
      if (
        !data.whatsapp_number.startsWith("http://") &&
        !data.whatsapp_number.startsWith("https://") &&
        !data.whatsapp_number.startsWith("wa.me/")
      ) {
        // Extract digits only for validation
        const digitsOnly = data.whatsapp_number.replace(/\D/g, "");
        // Take last 10 digits if it's a full number with country code
        const phoneToValidate = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
        
        if (phoneToValidate.length === 10) {
          const isPhoneNumberValid = validatePhoneNumber(phoneToValidate);
          if (!isPhoneNumberValid) {
            const apiError = new ApiError("Invalid Phone number", 400);
            return reply.status(apiError.statusCode).send(apiError.toJSON());
          }
          // Store only the 10-digit number
          data.whatsapp_number = phoneToValidate;
        } else if (digitsOnly.length > 0) {
          // If it's not 10 digits but has digits, it might be invalid
          const apiError = new ApiError("Invalid Phone number format", 400);
          return reply.status(apiError.statusCode).send(apiError.toJSON());
        }
      }
    }

    // Handle mobile_number - update User.phone
    let userPhoneUpdate: string | null | undefined = undefined;
    if (data.mobile_number !== undefined) {
      if (data.mobile_number === null || data.mobile_number.trim() === "") {
        userPhoneUpdate = null;
      } else {
        // Extract digits only
        const digitsOnly = data.mobile_number.replace(/\D/g, "");
        // Take last 10 digits if it's a full number with country code
        const phoneToValidate = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
        
        if (phoneToValidate.length === 10) {
          const isPhoneNumberValid = validatePhoneNumber(phoneToValidate);
          if (!isPhoneNumberValid) {
            const apiError = new ApiError("Invalid Mobile number", 400);
            return reply.status(apiError.statusCode).send(apiError.toJSON());
          }
          userPhoneUpdate = phoneToValidate;
        } else if (digitsOnly.length > 0) {
          const apiError = new ApiError("Invalid Mobile number format", 400);
          return reply.status(apiError.statusCode).send(apiError.toJSON());
        }
      }
    }

    const updateData: any = {};
    if (data.business_name !== undefined) updateData.business_name = data.business_name;
    if (data.whatsapp_number !== undefined) updateData.whatsapp_number = data.whatsapp_number;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
    if (data.background_photo_url !== undefined)
      updateData.background_photo_url = data.background_photo_url;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.instagram !== undefined) updateData.instagram = data.instagram;
    if (data.facebook !== undefined) updateData.facebook = data.facebook;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.business_hours !== undefined) updateData.business_hours = data.business_hours;
    if (data.categories !== undefined) updateData.categories = data.categories;
    if (data.latitude !== undefined) updateData.latitude = data.latitude?.toString() || null;
    if (data.longitude !== undefined) updateData.longitude = data.longitude?.toString() || null;
    if (data.location !== undefined) updateData.location = data.location;

    // Update seller profile
    const updatedSeller = await prisma.seller.update({
      where: { id: req.user.id },
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

    // Update user phone if mobile_number was provided
    if (userPhoneUpdate !== undefined) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { phone: userPhoneUpdate },
      });
      // Update the returned seller object with new phone
      updatedSeller.user.phone = userPhoneUpdate;
    }

    return reply.status(200).send(ApiResponse.success("Seller profile updated", updatedSeller));
  } catch (error) {
    console.log("Error updating seller profile", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const deleteSellerProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    nullCheckForUser(req);

    const seller = await prisma.seller.findFirst({
      where: { id: req.user.id },
    });

    if (!seller) {
      const apiError = new ApiError("Seller profile not found", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    await prisma.seller.delete({
      where: { id: req.user.id },
    });

    return reply.status(200).send(ApiResponse.success("Seller profile deleted"));
  } catch (error) {
    console.log("Error deleting seller profile", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};
