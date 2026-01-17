import { ApiError, verifyJwt } from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";

export const authenticateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const accessToken = req.cookies["accessToken"];
    if (!accessToken) {
      const apiError = new ApiError("accessToken not found", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const user = verifyJwt(accessToken);
    if (!user) {
      const apiError = new ApiError("Invalid Credentials", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    req.user = user;

    // if (!req.user.seller) {
    //   const apiError = new ApiError("Please Login as Seller", 403);
    //   return reply.status(apiError.statusCode).send(apiError);
    // }
  } catch (error) {
    console.log("Error getting auth status", error);
    const apiError = new ApiError("Internal Server Error");
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};
