import { FastifyInstance } from "fastify";
import {
  emailLogin,
  emailSignup,
  truecallerStatus,
  truecallerCallback,
  googleCallback,
  googleAuth,
  exchangeTokenAfterGoogleCallback,
  checkAuthStatus,
  googleCallbackQuerySchema,
  logout,
} from "@auth/index";

// todo add rate limiting to all the endpoints
export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/status", checkAuthStatus);
  fastify.post("/signup", emailSignup);
  fastify.post("/login", emailLogin);
  fastify.get("/logout", logout);
  fastify.post("/truecaller/callback", truecallerCallback);
  fastify.get("/truecaller/status", truecallerStatus);
  fastify.get("/google", googleAuth);
  fastify.get(
    "/google/callback",
    { schema: { querystring: googleCallbackQuerySchema } },
    googleCallback
  );
  fastify.get("/exchange", exchangeTokenAfterGoogleCallback);
};
