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
import { TrackPost } from "../../../entity/ContentPosts";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";
import { PostInput } from "../PostInput";

@InputType()
export class TrackPostInput extends PostInput {
  @Field()
  trackId: string;

  @Field()
  vote: number; // make -1 or 1

  @Field(() => [String])
  artistNames: string[];
}

@Resolver()
export class CreateTrackPostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => TrackPost)
  async createTrackPost(
    @Arg("data")
    { text, imageUrl, trackId, vote, artistNames }: TrackPostInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    console.log(ctx);

    let newPost: TrackPost;
    try {
      newPost = await TrackPost.create({
        text,
        imageUrl,
        trackId,
        vote,
        artistNames,
        user,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPost;
  }
}
