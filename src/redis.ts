import Redis from "ioredis";
console.log(`redis knows our env is ${process.env.NODE_ENV}`);
export const redis =
  process.env.NODE_ENV === "production"
    ? new Redis(process.env.REDIS_URL)
    : new Redis();
