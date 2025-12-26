import {
  getSellerProfile,
  getSellerProfileById,
  authenticateUser,
  createSellerProfile,
  updateSellerProfile,
  deleteSellerProfile,
} from "@user/index";
import type { FastifyInstance } from "fastify";

export const userRoutes = async (fastify: FastifyInstance) => {
  // Public route - get seller profile by ID
  fastify.get("/seller-profile/:seller_id", getSellerProfileById);

  // Protected routes
  fastify.addHook("preHandler", authenticateUser);

  fastify.get("/seller-profile", getSellerProfile);
  fastify.post("/create-seller-profile", createSellerProfile);
  fastify.put("/seller-profile", updateSellerProfile);
  fastify.delete("/seller-profile", deleteSellerProfile);
};
