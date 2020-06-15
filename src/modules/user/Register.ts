import { Resolver, Query, Mutation, Arg } from "type-graphql";
import * as bcrypt from "bcryptjs";

import { User } from "../../entity/User";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
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
