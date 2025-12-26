import {
  ApiError,
  ApiResponse,
  createCustomJwtPayload,
  devCookieOpts,
  env,
  prodAccessTokenOpts,
  signJwt,
  verifyJwt,
} from "@shared/index";
import { ExchangeTokenType, OAuthQuery } from "@auth/types/jwt.types";
import { FastifyReply, FastifyRequest } from "fastify";
import { googleClient } from "@auth/utils/auth.utils";
import { prisma } from "@shared/index";

export const googleAuth = async (
  req: FastifyRequest<{ Querystring: { type: "selling" | "shopping" } }>,
  reply: FastifyReply
) => {
  try {
    const client = googleClient();
    const type = req.query.type;

    if (!type || !["selling", "shopping"].includes(type)) {
      return reply.redirect(`${env.FRONTEND_URI}/discover?success=false`);
    }

    const redirectUrl = client.generateAuthUrl({
      access_type: "offline",
      state: type,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ],
      prompt: "select_account",
      response_type: "code",
    });

    return reply.redirect(redirectUrl);
  } catch (error) {
    console.log("Error generating oauth url", error);
    return reply.redirect(`${env.FRONTEND_URI}/discover?success=false`);
  }
};

export const googleCallback = async (
  req: FastifyRequest<{ Querystring: OAuthQuery }>,
  reply: FastifyReply
) => {
  const state = req.query?.state;
  const url = state === "shopping" ? "discover" : "dashboard";
  const seller: boolean = state === "selling";
  try {
    const code = req.query?.code;
    const error = req.query?.error;

    if (error) {
      return reply.redirect(`${env.FRONTEND_URI}/discover?success=false`);
    }

    if (!code || !state) {
      return reply.redirect(`${env.FRONTEND_URI}/discover?success=false`);
    }
    const client = googleClient();

    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      return reply.redirect(`${env.FRONTEND_URI}/${url}?success=false`);
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const userInfo = ticket.getPayload();
    if (!userInfo) {
      return reply.redirect(`${env.FRONTEND_URI}/${url}?success=false`);
    }
    const { email, name, sub, aud } = userInfo;

    if (aud !== env.GOOGLE_CLIENT_ID || !email || !name || !sub) {
      return reply.redirect(`${env.FRONTEND_URI}/${url}?success=invalid`);
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        last_sign_in: new Date(),
      },
      create: {
        name,
        email,
      },
      include: {
        seller_profile: true,
      },
    });

    await prisma.identity.upsert({
      where: {
        provider_id_provider: {
          provider: "google",
          provider_id: sub,
        },
      },
      update: {},
      create: {
        provider: "google",
        provider_id: sub,
        user_id: user.id,
      },
    });

    const payload = createCustomJwtPayload(user, seller);
    const token = signJwt(payload);

    return reply.redirect(`${env.FRONTEND_URI}/${url}?token=${token}`);
  } catch (error) {
    console.log("Error redirecting google oauth", error);
    return reply.redirect(`${env.FRONTEND_URI}/${url}?success=false`);
  }
};

export const exchangeTokenAfterGoogleCallback = async (
  req: FastifyRequest<{ Querystring: ExchangeTokenType }>,
  reply: FastifyReply
) => {
  try {
    const token = req.query.token;
    const type = req.query.type;
    // console.log("type", type);

    if (!token) {
      const apiError = new ApiError("Invalid Credentials", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const verify = verifyJwt(token);
    if (!verify) {
      const apiError = new ApiError("Invalid Credentials", 401);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    reply.setCookie(
      "accessToken",
      token,
      env.NODE_ENV === "production" ? prodAccessTokenOpts : devCookieOpts
    );

    return reply.status(200).send(ApiResponse.success("Login success", verify));
  } catch (error) {
    console.log("Error exchanging token", error);
    const apiError = new ApiError("Internal Server Error");
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};
