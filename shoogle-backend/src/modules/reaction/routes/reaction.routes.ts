import { toggleReaction, getUserReaction } from "@reaction/controllers/reaction.controller";
import { authenticateUser } from "@user/index";
import { FastifyInstance } from "fastify";

export const reactionRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authenticateUser);

  fastify.post("/", toggleReaction);
  fastify.get("/listing/:listing_id", getUserReaction);
};

