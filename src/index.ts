import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import cors from "cors";
import { redis } from "./redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { LoginResolver } from "./modules/user/LogIn";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  // for sessions - cross origin resource sharing
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000", // where the app will be hosted TODO: change this for expo
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "myredsecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("sever started on  http://localhost:4000/graphql");
  });
};

main();
