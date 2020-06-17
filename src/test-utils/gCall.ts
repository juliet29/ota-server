import { CreateSchema } from "../utils-global/createSchema";
import { graphql } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

export const gCall = async ({ source, variableValues }: Options) => {
  return graphql({
    schema: await CreateSchema(),
    source,
    variableValues,
  });
};
