import { Connection } from "typeorm";
import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";

let conn: Connection;

// open and close the connection before and after the tests run
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    username
    email
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            username: "newuser2",
            email: "bob@bob.com",
            password: "asdfasdf",
          },
        },
      })
    );
  });
});
