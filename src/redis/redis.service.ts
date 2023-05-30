import { Redis } from "ioredis";

const redis = new Redis({
  username: "default",
  port: 6379,
});

export { redis };
