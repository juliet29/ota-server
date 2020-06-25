import Redis from "ioredis";

console.log(`redis knows our env is ${process.env.NODE_ENV}`);
export const redis =
  process.env.NODE_ENV === "production"
    ? new Redis(
        "redis://h:peebd41813d2cafe19004d8d98771c5c8c4feb398c087adbb5c43fd0993f2d67c@ec2-54-221-237-152.compute-1.amazonaws.com:32209"
      )
    : new Redis();
