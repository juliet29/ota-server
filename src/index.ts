import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import "reflect-metadata";
import { redis } from "./redis";
import { CreateSchema } from "./utils-global/createSchema";
import { createTypeormConnection } from "./utils-global/createTypeormConn";

const main = async () => {
  await createTypeormConnection();

  const schema = await CreateSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = Express();

  // redis is for sessions, essentially long term authorization
  // make sure the redis store is running - redis-server /usr/local/etc/redis.conf
  const RedisStore = connectRedis(session);

  // cross origin resource sharing
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:19006", // where the app will be hosted TODO: change this for expo
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

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("sever started on  http://localhost:4000/graphql");
  });
};

main();
