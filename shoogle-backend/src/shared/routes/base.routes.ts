import { FastifyInstance } from "fastify";
import { healthCheck } from "@shared/index";

const baseRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", healthCheck);
};

export { baseRoutes };
