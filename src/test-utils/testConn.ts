import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "test",
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "julietnu",
    password: "mypass",
    database: "julietnutest",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../entity/*.*"],
  });
};
