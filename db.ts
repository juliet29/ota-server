import * as PostgressConnectionStringParser from "pg-connection-string";
import { DATABASE_URL } from "./dbURL";
import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const databaseUrl: string = DATABASE_URL; //process.env.DATABASE_URL;
const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl);
export default typeOrmOptions: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  host: "ec2-34-197-141-7.compute-1.amazonaws.com",
  port: 5432,
  username: "nxrtncjjqstevk",
  password: "e2d67b75b482bae7ce24906d9a04de9ab93b1a693a513f767448b0f37e22bcf2",
  database: "dfrc38j49583ok",
  // name: connectionOptions.name,
  // host: connectionOptions.host,
  // port: connectionOptions.port,
  // username: connectionOptions.username,
  // password: connectionOptions.password,
  // database: connectionOptions.database,
  synchronize: true,
  entities: ["target/entity/**/*.js"],
  extra: {
    ssl: true,
  },
};

// const connection = createConnection(typeOrmOptions);
