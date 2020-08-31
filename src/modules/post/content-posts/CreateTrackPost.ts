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

  @Field({ nullable: true })
  vote?: number; // make -1 or 1

  @Field()
  trackName: string;

  @Field(() => [String])
  artistNames: string[];
}

@Resolver()
export class CreateTrackPostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => TrackPost)
  async createTrackPost(
    @Arg("data")
    {
      text,
      imageUrl,
      trackId,
      vote,
      artistNames,
      trackName,
      externalUrl,
    }: TrackPostInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    console.log(ctx);
    if (!vote) {
      vote = 0;
    }

    let newPost: TrackPost;
    const likes = 0;
    try {
      newPost = await TrackPost.create({
        text,
        imageUrl,
        trackId,
        vote,
        artistNames,
        externalUrl,
        trackName,
        user,
        likes,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPost;
  }
}
