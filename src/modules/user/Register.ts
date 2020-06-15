import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Authorized()
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { username, email, password }: RegisterInput
  ): Promise<User> {
    // user's input is validated before hand in userInput.ts

    // hash the users password
    const hashedPassowrd = await bcrypt.hash(password, 12);

    // save the user into the database
    const user = await User.create({
      username,
      email,
      password: hashedPassowrd,
    }).save();

    return user;
  }
}
