import { Resolver, Mutation, Ctx } from "type-graphql";
// logout the user by deleting their session and clearing the cookies
import { MyContext } from "../../types/MyContext";
import { sendRefreshToken } from "../../utils-global/sendRefreshToken";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }
}
