import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ArtistPost } from "../../entity/ContentPosts";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class CreateArtistPostResolver {
  //   @UseMiddleware(isAuth)
  @Mutation(() => ArtistPost)
  async createArtistPost(@Arg("text") text: string, @Ctx() ctx: MyContext) {
    // get the user from the context
    // const user = await User.findOne(ctx.payload?.userId)!;
    // if (!user) {
    //   throw new AuthenticationError("User not found");
    // }
    console.log(ctx);
    const imageUrl: string = "dehehdehd";
    const artistId: string = "deheedehdehd";
    let newPost: ArtistPost;
    try {
      newPost = await ArtistPost.create({
        text,
        imageUrl,
        artistId,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPost;
  }
}
