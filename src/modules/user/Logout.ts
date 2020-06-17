import { Resolver, Mutation, Ctx } from "type-graphql";
// logout the user by deleting their session and clearing the cookies
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((res, rej) =>
      ctx.req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return rej(false);
        }

        // clear the cookies
        ctx.res.clearCookie("qid");

        return res(true);
      })
    );
  }
}
