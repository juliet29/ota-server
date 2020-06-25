import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";

import { CreateSchema } from "./utils-global/createSchema";
import { createTypeormConnection } from "./utils-global/createTypeormConn";

const main = async () => {
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:19006", // where the app will be hosted TODO: change this for expo
    })
  );
  app.use(cookieParser());
  app.get("/", (_req, res) =>
    res.send("Welcome to the OnTheAuxServer. GraphQL playground is at /graphql")
  );

  const conn = await createTypeormConnection();
  await conn.runMigrations();

  const schema = await CreateSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app, cors: false }); // try make true

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server started on  http://localhost:${port}/graphql`);
  });
};

main();
