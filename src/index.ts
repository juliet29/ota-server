import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hellowWorld() {
    return "Hello World!";
  }
}

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("sever started on  http://localhost:4000/graphql");
  });
};

main();
