import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import "dotenv/config";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, "ACCESS_TOKEN_SEC", {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, "REFRESH_TOKEN_SEC", {
    expiresIn: "7d",
  });
};
