// ensure that the user has authentication/their session exists
// userId cookie must be available on session to access authorized resolvers
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "src/types/MyContext";

export const isAuth: Middleware<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("not authenticated");
  }

  return next();
};
