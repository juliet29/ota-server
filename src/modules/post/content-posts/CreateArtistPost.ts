import { AuthenticationError } from "apollo-server-express";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ArtistPost } from "../../../entity/ContentPosts";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";
import { PostInput } from "../PostInput";

@InputType()
export class ArtistPostInput extends PostInput {
  @Field()
  artistId: string;
}

@Resolver()
export class CreateArtistPostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => ArtistPost)
  async createArtistPost(
    @Arg("data") { text, imageUrl, artistId }: ArtistPostInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    console.log(ctx);

    let newPost: ArtistPost;
    try {
      newPost = await ArtistPost.create({
        text,
        imageUrl,
        artistId,
        user,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPost;
  }
}
