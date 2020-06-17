// after user has clicked on confirmation link in their email, they can log in
import { redis } from "../../redis";
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(token);

    return true;
  }
}
