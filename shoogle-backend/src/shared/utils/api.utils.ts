import { Prisma } from "@prisma/client";
import z, { ZodError } from "zod";

export class ApiError extends Error {
  constructor(message?: string, public statusCode: number = 500, public errors?: any) {
    super(message || "Internal Server Error");
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;

    // dont include the ApiError's stack in the Error stack
    if (Error.captureStackTrace) Error.captureStackTrace(this, ApiError);
  }

  static fromZodError(error: ZodError) {
    return new ApiError("Validation failed", 400, z.prettifyError(error));
  }

  // also handles fallback
  static fromPrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return new ApiError("Record already exists", 400);
      if (error.code === "P2003") return new ApiError("Foreign key constraint failed", 400);
      if (error.code === "P2025") return new ApiError("Record not found", 404);
      else return new ApiError("Database Error", 500, error);
    }

    return new ApiError(error.message, 500, error);
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

export class ApiResponse<T = any> {
  constructor(public success: boolean, public message: string, public data?: T) {}

  static success<T>(message: string = "Success", data?: T) {
    return new ApiResponse<T>(true, message, data);
  }

  // to maintain consistency
  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
