import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./secrets";

export const createAccessToken = (user: User) => {
  // const thisId = user.facebookId ? user.facebookId : user.id;
  return sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    // TODO: change expiry, make way to automatically update access token
    expiresIn: "60m",
  });
};

export const createRefreshToken = (user: User) => {
  // const thisId = user.facebookId ? user.facebookId : user.id;
  return sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
