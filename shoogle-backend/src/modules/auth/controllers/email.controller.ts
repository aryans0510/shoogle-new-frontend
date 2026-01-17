import bcrypt from "bcrypt";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { emailLoginSchema, emailSignupSchema } from "@auth/index";
import {
  prisma,
  ApiError,
  ApiResponse,
  prodAccessTokenOpts,
  devCookieOpts,
  env,
  signJwt,
  createCustomJwtPayload,
} from "@shared/index";


export const emailSignup = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validate = emailSignupSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    const { name, email, password } = validate.data;

    const checkIfExists = await prisma.user.findUnique({
      where: { email },
    });
    if (checkIfExists) {
      const apiError = new ApiError("Account already exists", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
      },
    });

    return reply.status(201).send(ApiResponse.success("Account created successfully"));
  } catch (error: any) {
    console.log("signup error", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};

export const emailLogin = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validate = emailLoginSchema.safeParse(req.body);
    if (!validate.success) {
      const apiError = ApiError.fromZodError(validate.error);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }
    const { email, password, mode } = validate.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const apiError = new ApiError("Account doesn't exists", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    // check of truecaller, google or email auth and reject
    if (!user.password_hash) {
      const apiError = new ApiError("Account doesn't exists", 404);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const apiError = new ApiError("Incorrect Password", 400);
      return reply.status(apiError.statusCode).send(apiError.toJSON());
    }

    const seller: boolean = mode === "selling";
    const payload = createCustomJwtPayload(user, seller);
    const token = signJwt(payload);

    // fixme add refreshTokens with longer expiry
    reply.setCookie(
      "accessToken",
      token,
      env.NODE_ENV === "production" ? prodAccessTokenOpts : devCookieOpts
    );

    return reply.status(200).send(ApiResponse.success("Login success", payload));
  } catch (error) {
    console.log("login error", error);
    const apiError = ApiError.fromPrismaError(error);
    return reply.status(apiError.statusCode).send(apiError.toJSON());
  }
};
