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
    // search for the user in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    // if we find the user, compare the passwords entered
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    // give the user a session if everything is good
    ctx.req.session!.userId = user.id;

    return user;
  }
}
