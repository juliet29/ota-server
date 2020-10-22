import { AuthenticationError } from "apollo-server-express";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { User } from "../../entity/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Comment } from "../../entity/Comment";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { Poll } from "../../entity/Poll";
import { Playlist } from "../../entity/Playlist";

@InputType()
export class CommentInput {
  @Field()
  text: string;

  @Field()
  id: number;

  @Field()
  postType: string;
}

@Resolver()
export class CreateCommentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async createComment(
    @Arg("data")
    { text, id, postType }: CommentInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    let trackPost, artistPost, albumPost, poll;
    // let postComments;

    switch (postType) {
      case "track": {
        trackPost = await TrackPost.findOne(id);
        // Comment.find({
        //   where: [
        //     { trackPostId: id },
        //   ]})
        //   postComments = Comment.findAndCount({
        //     where: [
        //       { trackPostId: id },
        //     ]})
        break;
      }
      case "artist": {
        artistPost = await ArtistPost.findOne(id);
        break;
      }
      case "album": {
        albumPost = await AlbumPost.findOne(id);
        break;
      }
      case "poll": {
        poll = await Poll.findOne(id);
        break;
      }
      case "playlist": {
        poll = await Playlist.findOne(id);
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }

    // console.log("postComms", postComments)

    let newComment: Comment;
    const likes = 0;
    try {
      newComment = await Comment.create({
        text,
        user,
        likes,
        trackPost,
        albumPost,
        artistPost,
        poll,
        // playlist
      }).save();
    } catch (err) {
      throw new Error(err);
    }
    console.log("sender of a new comment", newComment.user.email);

    // update number of comments on a post

    // go through all comments, get number where post id = id, post type is right

    // get the post, and set number to num comments

    return newComment;
  }
}
