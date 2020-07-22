import { CreateSchema } from "../global-utils/createSchema";
import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
  // only create a new schema if one is not already existing
  if (!schema) {
    schema = await CreateSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
