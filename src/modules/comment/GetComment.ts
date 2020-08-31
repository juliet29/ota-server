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
    // get all the comments associated with a single pos
    //TODO: get users too https://typeorm.io/#/relational-query-builder
    // const comments =
    //   postType === "track"
    //     ? await createQueryBuilder()
    //         .relation(TrackPost, "comment")
    //         .of(id)
    //         .loadMany()
    //     : postType === "artist"
    //     ? await createQueryBuilder()
    //         .relation(ArtistPost, "comment")
    //         .of(id)
    //         .loadMany()
    //     : postType === "album"
    //     ? await createQueryBuilder()
    //         .relation(AlbumPost, "comment")
    //         .of(id)
    //         .loadMany()
    //     : null;

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
