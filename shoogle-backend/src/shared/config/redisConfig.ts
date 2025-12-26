import Redis from "ioredis";
import { env } from "@shared/index";

let redis: Redis;

try {
  redis = new Redis(env.REDIS_URI, {
    connectTimeout: 10000,
    retryStrategy: times => Math.min(times * 50, 2000), // Retry strategy
    // tsl:{}      // If we are dealing with secure TLS connection
  });

  redis.on("connect", () => console.log("Redis connected"));
  redis.on("error", error => console.log("Redis connection error", error));
} catch (error) {
  console.log("Failed to initalize Redis: ", error);
  process.exit(1);
}

export { redis };
