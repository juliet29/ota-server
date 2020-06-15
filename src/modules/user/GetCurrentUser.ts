// gets the user based on the cookie saved in the session
import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class GetCurrentUserResolver {
  @Query(() => User, { nullable: true })
  async getCurrentUser(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
