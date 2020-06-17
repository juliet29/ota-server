import { v4 } from "uuid";
import { redis } from "../redis";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day
  // TODO need to fix not real
  return `http://localhost:4000/user/confirm/${token}`;
};
