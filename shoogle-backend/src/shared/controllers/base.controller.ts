import { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponse } from "@shared/index";

export const healthCheck = async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send(ApiResponse.success("v1 api Healthcheck passed"));
};
