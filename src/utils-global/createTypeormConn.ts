import { getConnectionOptions, createConnection } from "typeorm";
import { User } from "../entity/User";
// import * as PostgressConnectionStringParser from "pg-connection-string";

export const createTypeormConnection = async () => {
  // const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  // return process.env.NODE_ENV === "production"
  //   ? createConnection({
  //       type: "postgres",
  //       url: process.env.DATABASE_URL,
  //       synchronize: true,
  //       logging: true,
  //     } as any)
  //   : createConnection({ ...connectionOptions });
  console.log(process.env.DATABASE_URL);
  if (process.env.DATABASE_URL) {
    console.log(process.env.DATABASE_URL);
    // const connectionOptions = PostgressConnectionStringParser.parse(
    //   process.env.DATABASE_URL!
    // );
    createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [User],
      extra: {
        ssl: true,
      },
    } as any);
  } else {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    createConnection({ ...connectionOptions });
  }
};
