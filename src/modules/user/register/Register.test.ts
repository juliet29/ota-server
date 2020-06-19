import { Connection } from "typeorm";
import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";
import faker from "faker";
import { User } from "../../../entity/User";

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
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    // make a graphql call
    if (response.errors) {
      console.log(response.errors[0].originalError);
    }

    // expect the response of the graphql to have this format
    expect(response).toMatchObject({
      data: {
        register: {
          username: user.username,
          email: user.email,
        },
      },
    });

    // expect the unconfirmed user to be stored correctly in the database
    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.username).toBe(user.username);
  });
});
