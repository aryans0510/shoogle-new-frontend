import { Category, ListingAvailability } from "@prisma/client";
import z from "zod/v4";

// Explicitly define enum values for zod validation
const CategoryValues = ["Electronics", "Appliances", "Services", "Clothing", "Toys", "Art", "Health", "Other"] as const;
const ListingAvailabilityValues = ["pickup", "delivery", "both"] as const;

export const generateListingUrlSchema = z.strictObject({
  type: z.enum([
    "jpg",
    "jpeg",
    "png",
    "gif",
    "svg",
    "webp",
    "tiff",
    "tif",
    "bmp",
    "pdf",
    "eps",
    "ai",
    "psd",
    "raw",
    "heif",
    "heic",
    "ico",
    "avif",
  ]),
});

export const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(CategoryValues, {
    errorMap: () => ({ message: `Category must be one of: ${CategoryValues.join(", ")}` }),
  }),
  price: z.number().optional().nullable(),
  tags: z.array(z.string()).optional(),
  availability: z.enum(ListingAvailabilityValues, {
    errorMap: () => ({ message: `Availability must be one of: ${ListingAvailabilityValues.join(", ")}` }),
  }),
  location: z.string().optional().nullable(),
  media_urls: z.array(z.string().url("Each media URL must be a valid URL")).optional(),
});

export const updateListingSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  category: z.enum(CategoryValues).optional(),
  price: z.number().optional().nullable(),
  tags: z.array(z.string()).optional(),
  availability: z.enum(ListingAvailabilityValues).optional(),
  location: z.string().optional().nullable(),
  media_urls: z.array(z.string().url()).optional(),
  status: z.string().optional(),
  visible_in_discovery: z.boolean().optional(),
});

export const getListingsQuerySchema = z.object({
  category: z.enum(CategoryValues).optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  availability: z.enum(ListingAvailabilityValues).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  visible_in_discovery: z.coerce.boolean().optional(),
});
