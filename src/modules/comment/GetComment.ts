import { Arg, Query, Resolver } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Comment } from "../../entity/Comment";
import { TrackPost, ArtistPost, AlbumPost } from "../../entity/ContentPosts";
import { CommentInput } from "./CreateComment";

@Resolver()
export class GetCommentsResolver {
  @Query(() => [Comment])
  async getComments(
    @Arg("data")
    { id, postType }: CommentInput
  ) {
    // get all the comments associated with a single pos
    const comments =
      postType === "track"
        ? await createQueryBuilder()
            .relation(TrackPost, "comment")
            .of(id)
            .loadMany()
        : postType === "artist"
        ? await createQueryBuilder()
            .relation(ArtistPost, "comment")
            .of(id)
            .loadMany()
        : postType === "album"
        ? await createQueryBuilder()
            .relation(AlbumPost, "comment")
            .of(id)
            .loadMany()
        : null;

    return comments;
  }
}
