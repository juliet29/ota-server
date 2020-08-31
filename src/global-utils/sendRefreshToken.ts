import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  console.log("sending ref token....");
  res.cookie("jid", token, {
    httpOnly: true,
    // sameSite:"none, secure";
    path: "/refresh_token",
  });
  // console.log(cookie);
};
