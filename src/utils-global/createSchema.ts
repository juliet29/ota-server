import { buildSchema } from "type-graphql";

export const CreateSchema = () =>
  buildSchema({
    resolvers: [__dirname + "/../modules/*/*.ts"],
    // userId cookie must be available on session to access authorized resolvers
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
