import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  seller: boolean;
  // isOnboarded: boolean;
}

export interface OAuthQuery {
  code?: string;
  error?: string;
  state: "selling" | "shopping";
}

export interface ExchangeTokenType {
  token: string;
  type: "selling" | "shopping";
}

// not used currently
export type ExtendedUser = Prisma.UserGetPayload<{
  include: {
    seller_profile: true;
  };
}>;
