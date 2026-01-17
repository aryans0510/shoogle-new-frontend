import jwt from "jsonwebtoken";
import { env } from "@shared/index";
import { CookieSerializeOptions } from "@fastify/cookie";
import { CustomJwtPayload } from "@auth/index";
import { User } from "@prisma/client";

const pubKey = env.JWT_PUBLIC_SECRET;
const pvtKey = env.JWT_PRIVATE_SECRET;

// verify that seller data is present, if setting to true
export const createCustomJwtPayload = (user: User, seller: boolean): CustomJwtPayload => {
  return {
    id: user.id,
    name: user.name,
    seller,
  };
};

export const signJwt = (payload: CustomJwtPayload) => {
  return jwt.sign(payload, pvtKey, { algorithm: "RS256" });
};

export const verifyJwt = (token: string): CustomJwtPayload | undefined => {
  try {
    if (!token) return;
    return jwt.verify(token, pubKey) as CustomJwtPayload;
  } catch (error) {
    return;
  }
};

export const prodAccessTokenOpts: CookieSerializeOptions = {
  path: "/",
  domain: ".shoogle.in",
  maxAge: 60 * 60 * 24 * 15,
  secure: true,
  sameSite: "none",
  httpOnly: true,
};

export const prodRefreshTokenOpts: CookieSerializeOptions = {
  path: "/",
  domain: ".shoogle.in",
  maxAge: 60 * 60 * 24 * 15,
  secure: true,
  sameSite: "none",
  httpOnly: true,
};

export const devCookieOpts: CookieSerializeOptions = {
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hrs
  sameSite: "lax", // always use lax in development
  httpOnly: true,
};
