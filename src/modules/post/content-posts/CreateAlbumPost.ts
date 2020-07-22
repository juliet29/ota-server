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
import { AlbumPost } from "../../../entity/ContentPosts";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";
import { PostInput } from "../PostInput";

@InputType()
export class AlbumPostInput extends PostInput {
  @Field()
  albumId: string;

  @Field()
  rating: number;

  @Field()
  albumName: string;

  @Field(() => [String])
  artistNames: string[];
}

@Resolver()
export class CreateAlbumPostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => AlbumPost)
  async createAlbumPost(
    @Arg("data")
    {
      text,
      imageUrl,
      albumId,
      rating,
      artistNames,
      externalUrl,
      albumName,
    }: AlbumPostInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    let newPost: AlbumPost;
    try {
      newPost = await AlbumPost.create({
        text,
        imageUrl,
        albumId,
        rating,
        externalUrl,
        artistNames,
        albumName,
        user,
      }).save();
    } catch (err) {
      throw new Error(err);
    }
    console.log("my post user", newPost.user.email);

    return newPost;
  }
}
