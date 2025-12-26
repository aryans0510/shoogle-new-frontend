import { CustomJwtPayload } from "@auth/index";
import { ApiError } from "@shared/index";
import { FastifyRequest } from "fastify";

export function nullCheckForUser(
  req: FastifyRequest
): asserts req is FastifyRequest & { user: CustomJwtPayload } {
  if (!req.user) {
    const apiError = new ApiError("Invalid Credentials", 401);
    throw apiError;
  }
}
