import { Arg, Query, Resolver } from "type-graphql";
import { Comment } from "../../entity/Comment";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { CommentInput } from "./CreateComment";
import { createQueryBuilder } from "typeorm";
import { Poll } from "../../entity/Poll";
import { Playlist } from "../../entity/Playlist";

@Resolver()
export class GetCommentsResolver {
  @Query(() => [Comment])
  async getComments(
    @Arg("data")
    { id, postType }: CommentInput
  ) {
    const entity =
      postType === "track"
        ? TrackPost
        : postType === "artist"
        ? ArtistPost
        : postType === "album"
        ? AlbumPost
        : postType === "poll"
        ? Poll
        : postType === "playlist"
        ? Playlist
        : null;

    if (entity) {
      // get comments on the post
      const comments: Comment[] = await createQueryBuilder()
        .relation(entity, "comment")
        .of(id)
        .loadMany();

      // update the post comments number
      entity.update(id, { numComments: comments.length });
      console.log("updaying comments?", comments.length);

      // get person who made the comment
      let el;
      let commentwithUserArray = new Array<Comment>();

      for (el in comments) {
        const commentwithUser = (
          await Comment.find({
            where: { id: comments[el].id },
            relations: ["user"],
          })
        )[0];
        commentwithUserArray.push(commentwithUser);
      }
      // console.log("hi")
      return commentwithUserArray;
    }

    return null;
  }
}
