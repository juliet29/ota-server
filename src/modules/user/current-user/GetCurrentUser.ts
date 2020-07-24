// gets the user based on the cookie saved in the session
import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../../global-utils/secrets";

@Resolver()
export class GetCurrentUserResolver {
  @Query(() => User, { nullable: true })
  async getCurrentUser(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const authorization = ctx.req.headers["authorization"];

    if (!authorization) {
      throw new Error(`your context is ${ctx.req.headers["authorization"]}`);
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, ACCESS_TOKEN_SECRET!);
      return User.findOne(payload!.userId);
    } catch (err) {
      console.log(err);
      throw new Error(`couldnt find user ${err}`);
      return undefined;
    }
  }
}
