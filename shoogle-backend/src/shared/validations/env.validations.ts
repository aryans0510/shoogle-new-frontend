import "dotenv/config";
import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_URL: z.string(),
  FRONTEND_URI: z.string(),
  JWT_PRIVATE_SECRET: z.string(),
  JWT_PUBLIC_SECRET: z.string(),
  REDIS_URI: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  AWS_IAM_ACCESS_KEY: z.string(),
  AWS_IAM_SECRET_ACCESS_KEY: z.string(),
});

const validate = envSchema.safeParse(process.env);

if (!validate.success) {
  console.log("Error parsing env variables", JSON.parse(validate.error.message));
  process.exit(1);
}

const env = validate.data;
export { env };
