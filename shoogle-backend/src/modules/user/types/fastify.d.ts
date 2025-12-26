import { FastifyRequest } from "fastify";
import { CustomJwtPayload } from "../../auth/types/jwt.types";
import { Seller } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    user?: CustomJwtPayload | null;
  }
}
