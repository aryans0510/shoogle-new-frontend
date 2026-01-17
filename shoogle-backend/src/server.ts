import { env, connectDB, redis, baseRoutes } from "@shared/index";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { userRoutes } from "@user/index";
import { authRoutes } from "@auth/index";
import formBody from "@fastify/formbody";
import fastifyCookie from "@fastify/cookie";
import fastifySSE from "@fastify/sse";
import fastifyRedis from "@fastify/redis";
import { listingRoutes } from "@listing/index";
import { reviewRoutes } from "@review/index";
import { sellerReviewRoutes } from "@seller-review/index";
import { reactionRoutes } from "@reaction/index";

const fastify = Fastify();
const PORT = env.PORT;

const start = async () => {
  await connectDB();
  await fastify.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    origin: ["https://hrxktc3r-5173.inc1.devtunnels.ms", env.FRONTEND_URI],
    credentials: true,
  });

  await fastify.register(formBody);
  await fastify.register(fastifyCookie);
  await fastify.register(fastifySSE);
  await fastify.register(fastifyRedis, {
    client: redis,
    closeClient: true,
  });
  await fastify.register(baseRoutes, { prefix: "/api/v1" });
  await fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  await fastify.register(userRoutes, { prefix: "/api/v1/user" });
  await fastify.register(listingRoutes, { prefix: "/api/v1/listing" });
  await fastify.register(reviewRoutes, { prefix: "/api/v1/review" });
  await fastify.register(sellerReviewRoutes, { prefix: "/api/v1/seller-review" });
  await fastify.register(reactionRoutes, { prefix: "/api/v1/reaction" });

  fastify.setErrorHandler((err, req, reply) => {
    console.log("global err", err);
    return reply.status(500).send({ message: "Internal Server Error" });
  });

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server started at http://localhost:${PORT}`);
  } catch (error) {
    console.log("Error starting fastify server", error);
    process.exit(1);
  }
};

start();
