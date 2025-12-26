import {
  createSellerReview,
  getSellerReviews,
  updateSellerReview,
  deleteSellerReview,
} from "@seller-review/controllers/seller-review.controller";
import { authenticateUser } from "@user/index";
import { FastifyInstance } from "fastify";

export const sellerReviewRoutes = async (fastify: FastifyInstance) => {
  // Public route
  fastify.get("/seller/:seller_id", getSellerReviews);

  // Protected routes
  fastify.addHook("preHandler", authenticateUser);

  fastify.post("/", createSellerReview);
  fastify.put("/:id", updateSellerReview);
  fastify.delete("/:id", deleteSellerReview);
};

