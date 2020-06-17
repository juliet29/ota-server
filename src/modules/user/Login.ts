import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    // search for the user in the database based on their emal
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("user not found");
      return null;
    }

    // if we find the user, compare the passwords entered
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.log("password not valid");
      return null;
    }

    if (!user.confirmed) {
      console.log("you need to confirm your email");
      return null;
    }

    // give the user a session if everything is good
    ctx.req.session!.userId = user.id;

    return user;
  }
}
