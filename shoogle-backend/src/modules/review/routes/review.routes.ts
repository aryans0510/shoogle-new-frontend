import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByListing,
  createReviewReply,
  updateReviewReply,
  deleteReviewReply,
} from "@review/controllers/review.controller";
import { authenticateUser } from "@user/index";
import { FastifyInstance } from "fastify";

export const reviewRoutes = async (fastify: FastifyInstance) => {
  // Public route - get reviews for a listing
  fastify.get("/listing/:listing_id", getReviewsByListing);

  // Protected routes
  fastify.addHook("preHandler", authenticateUser);

  fastify.post("/", createReview);
  fastify.put("/:id", updateReview);
  fastify.delete("/:id", deleteReview);
  fastify.post("/reply", createReviewReply);
  fastify.put("/reply/:id", updateReviewReply);
  fastify.delete("/reply/:id", deleteReviewReply);
};

