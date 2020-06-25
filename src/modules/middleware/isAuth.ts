// ensure that the user has authentication/their session exists
// userId cookie must be available on session to access authorized resolvers
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "src/types/MyContext";
import { verify } from "jsonwebtoken";

export const isAuth: Middleware<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated -- headers not passed");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, "ACCESS_TOKEN_SEC");
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated -- token not valid");
  }

  return next();
};
