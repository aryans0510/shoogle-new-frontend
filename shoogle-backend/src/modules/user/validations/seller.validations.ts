import parsePhoneNumberFromString from "libphonenumber-js";
import z from "zod/v4";

export const createSellerProfileSchema = z.strictObject({
  business_name: z.string().max(50, "business name cannot be more than 50 characters long"),
  whatsapp_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
});

export const updateSellerProfileSchema = z.object({
  business_name: z.string().max(50).optional(),
  whatsapp_number: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val || val === null) return true;
        // Allow URLs/links
        if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("wa.me/")) {
          return true;
        }
        // Extract digits only and validate
        const digitsOnly = val.replace(/\D/g, "");
        // Must be 10 digits starting with 6-9, or allow longer numbers (will be validated in controller)
        return /^[6-9]\d{9}$/.test(digitsOnly) || digitsOnly.length >= 10;
      },
      { message: "Invalid WhatsApp number or link" }
    ),
  mobile_number: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val || val === null) return true;
        // Extract digits only and validate
        const digitsOnly = val.replace(/\D/g, "");
        // Must be 10 digits starting with 6-9, or allow longer numbers (will be validated in controller)
        return /^[6-9]\d{9}$/.test(digitsOnly) || digitsOnly.length >= 10;
      },
      { message: "Invalid mobile number" }
    ),
  avatar_url: z.string().url().optional().nullable(),
  background_photo_url: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().optional().nullable(),
  business_hours: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  location: z.string().optional().nullable(),
});

export const validatePhoneNumber = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, { defaultCountry: "IN" });

  if (phoneNumber && phoneNumber.isValid()) return true;
  else return false;
};
