import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import "dotenv/config";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, "accesstokensec", {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, "reftokensec", {
    expiresIn: "7d",
  });
};
