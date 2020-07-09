import { Resolver, UseMiddleware, Mutation, Arg, Ctx } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
// import { BasePost } from "../../entity/BasePost";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";
import { AuthenticationError } from "apollo-server-express";

@Resolver()
export class CreatePostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async createPost(
    @Arg("text") text: string,
    @Arg("link") link: string,
    @Ctx() ctx: MyContext
  ) {
    // TODO: create input field to handle validation

    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    // const timeSubmitted = new Date().toISOString();

    // // save the new post into the database
    // // try {
    // //   await BasePost.create({
    // //     text,
    // //     link,
    // //     user, // TODO hmmm
    // //     timeSubmitted,
    // //     ...user,
    // //   }).save();
    // // } catch (err) {
    // //   throw new Error(err);
    // // }

    // // TODO: save on the user table as well

    return [text, link];
  }
}
