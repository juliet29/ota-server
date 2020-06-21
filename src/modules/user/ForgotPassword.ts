import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { User } from "../../entity/User";
import { redis } from "../../utils-global/redis";
import { sendEmail } from "../utils/sendEmail";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // TODO throw an error if the email is not in the db
      return true;
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24);

    // TODO make different email template
    await sendEmail(
      email,
      `http://localhost:4000/user/change-password/${token}`
    );

    return true;
  }
}
