import axios from "axios";
import {
  ApiResponse,
  createCustomJwtPayload,
  devCookieOpts,
  env,
  prodAccessTokenOpts,
  redis,
  signJwt,
} from "@shared/index";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@shared/index";
import { createTruecallerUser } from "@auth/utils/auth.utils";
import { User } from "@prisma/client";

export const truecallerCallback = async (req: FastifyRequest, reply: FastifyReply) => {
  const {
    requestId: sessionId,
    accessToken,
    endpoint,
    status,
  } = req.body as { requestId: string; accessToken?: string; endpoint?: string; status?: string };
  try {
    reply.status(200).send(ApiResponse.success("Callback received"));

    if (status) {
      await redis.set(`auth_status:${sessionId}`, JSON.stringify({ status }), "EX", 3600);
    }

    if (!endpoint) {
      return reply.status(200).send(ApiResponse.success("Endpoint is required"));
    }

    const res = await axios.get(endpoint, {
      headers: {
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const seller: boolean = sessionId.split("-")[0] === "selling";
    console.log("seller", seller);

    await redis.set(
      `auth_status:${sessionId}`,
      JSON.stringify({ status: "success", data: res.data }),
      "EX",
      600
    );
  } catch (error) {
    console.log("truecaller callback error", error);
    await redis.set(
      `auth_status:${sessionId}`,
      JSON.stringify({ status: "Authentication failed" }),
      "EX",
      600
    );
  }
};

export const truecallerStatus = async (
  req: FastifyRequest<{ Querystring: { sessionId: string; type: "selling" | "shopping" } }>,
  reply: FastifyReply
) => {
  try {
    const { sessionId, type } = req.query;
    if (!sessionId) {
      return reply.status(400).send({ message: "Session ID is required" });
    }

    // Check Redis for the authentication status or user data
    const result = await redis.get(`auth_status:${sessionId}`);
    if (result === null) {
      return reply.status(401).send(new ApiResponse(false, "Data not Found in Redis"));
    }

    const seller: boolean = type === "selling";
    const parse = JSON.parse(result);
    const { status, data: parseData } = parse as { status: string; data?: any };

    if (status === "user_rejected" || status === "use_another_number") {
      return reply.status(200).send(new ApiResponse(false, "exit_flow"));
    }

    if (status !== "success") {
      return reply.status(200).send(new ApiResponse(false, "Some Error occured"));
    }

    const email = parseData.onlineIdentities?.email;
    const phone = parseData.phoneNumbers[0]?.toString();

    let user: User | null = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email }, include: { seller_profile: true } });
    }
    if (!user && phone) {
      user = await prisma.user.findUnique({ where: { phone }, include: { seller_profile: true } });
    }

    // create user if not exists and return
    if (!user) {
      user = await createTruecallerUser(parseData);
      const payload = createCustomJwtPayload(user, seller);
      const token = signJwt(payload);
      reply.setCookie(
        "accessToken",
        token,
        env.NODE_ENV === "production" ? prodAccessTokenOpts : devCookieOpts
      );
      return reply.status(200).send(ApiResponse.success("Account created", payload));
    }

    // ensure truecaller exists in "identity" table
    await prisma.identity.upsert({
      where: {
        provider_id_provider: {
          provider_id: parseData.id,
          provider: "truecaller",
        },
      },
      update: {},
      create: {
        provider_id: parseData.id,
        provider: "truecaller",
        user_id: user.id,
      },
    });

    // update phone no.
    await prisma.user.update({
      where: { id: user.id },
      data: { phone, last_sign_in: new Date() },
    });

    const payload = createCustomJwtPayload(user, seller);
    const token = signJwt(payload);
    reply.setCookie(
      "accessToken",
      token,
      env.NODE_ENV === "production" ? prodAccessTokenOpts : devCookieOpts
    );

    return reply.status(200).send(ApiResponse.success("Auth success", payload));
  } catch (error) {
    console.log("Error in Polling", error);
    return reply.status(500).send(new ApiResponse(false, "Some Error occured"));
  }
};
