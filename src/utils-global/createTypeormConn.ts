import { getConnectionOptions, createConnection } from "typeorm";
import { User } from "../entity/User";
import { Listing } from "../entity/Listing";

export const createTypeormConnection = async () => {
  console.log(`typeorm knows our env is ${process.env.NODE_ENV}`);
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    const productionConn = {
      ...connectionOptions,
      url: process.env.DATABASE_URL,
      entities: [User, Listing],
      name: "default",
    } as any;
    // url will only be defined when actually in production
    console.log(productionConn);

    return createConnection(productionConn);
  } else {
    console.log(connectionOptions);
    return createConnection({ ...connectionOptions, name: "default" });
  }
};
