import { z } from "zod/v4";

export const emailSignupSchema = z.strictObject({
  email: z.string().trim().pipe(z.email()),
  name: z.string(),
  password: z.string(),
});

export const emailLoginSchema = z.strictObject({
  email: z.string().trim().pipe(z.email()),
  password: z.string(),
  mode: z.literal(["selling", "shopping"]),
});
