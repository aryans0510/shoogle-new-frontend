import {
  createListing,
  updateListing,
  deleteListing,
  getListingById,
  getListings,
  generateS3UrlForListingImageUpload,
  getUserListings,
} from "@listing/index";
import { authenticateUser } from "@user/index";
import { FastifyInstance } from "fastify";

const listingRoutes = async (fastify: FastifyInstance) => {
  // Public routes - must be registered before auth hook
  fastify.get("/public", getListings);
  fastify.get("/:id", getListingById);
  
  // Register protected routes in a separate context
  await fastify.register(async function (fastify) {
    fastify.addHook("preHandler", authenticateUser);
    
    fastify.get("/", getUserListings);
    fastify.post("/create", createListing);
    fastify.post("/generate-bucket-url", generateS3UrlForListingImageUpload);
    fastify.put("/:id", updateListing);
    fastify.delete("/:id", deleteListing);
  });
};

export { listingRoutes };
