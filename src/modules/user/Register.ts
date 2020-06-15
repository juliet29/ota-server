import { Resolver, Query, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { username, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassowrd = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassowrd,
    }).save();

    return user;
  }
}
