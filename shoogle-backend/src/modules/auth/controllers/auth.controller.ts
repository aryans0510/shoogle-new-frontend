import { type FastifyReply, type FastifyRequest } from "fastify";
import { ApiError, ApiResponse, verifyJwt } from "@shared/index";

export const checkAuthStatus = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const accessToken = req.cookies["accessToken"];
    if (!accessToken) {
      const apiError = new ApiError("accessToken not found", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const verify = verifyJwt(accessToken);
    if (!verify) {
      const apiError = new ApiError("Invalid Credentials", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    return reply.status(200).send(new ApiResponse(true, "Credentials valid", verify));
  } catch (error) {
    console.log("Error in userMiddleware", error);
    const apiError = new ApiError("Internal Server Error");
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const logout = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    reply.clearCookie("accessToken");

    return reply.status(200).send(ApiResponse.success("Logged out"));
  } catch (error) {
    console.log("Logout error", error);
    const apiError = new ApiError("Internal Server Error");
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const refreshTokens = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    
  } catch (error) {
    console.log("");
    
  }
};
