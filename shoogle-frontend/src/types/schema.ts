import { z } from "zod/v4";

export const signupSchema = z.strictObject({
  name: z.string().max(50, "Name too long"),
  email: z.email("Invalid email"),
  password: z.string().min(5, "Length must be more than 5 characters").max(30, "Password too long"),
});

export const loginSchema = z.strictObject({
  name: z.string().max(50, "Name too long"),
  email: z.email("Invalid email"),
  password: z.string().min(5, "Length must be more than 5 characters").max(30, "Password too long"),
});

export const onboardingSchema = z.strictObject({
  business_name: z.string().max(50, "Business name too long"),
  whatsapp_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
});
