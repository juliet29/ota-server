import {
  Arg,
  Mutation,
  Resolver,
  UseMiddleware,
  InputType,
  Field,
} from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { TrackPost, AlbumPost, ArtistPost } from "../../entity/ContentPosts";
import { GetPostsResultUnion } from "./GetPosts";

@InputType()
export class LikeInput {
  @Field()
  postType?: string;

  @Field()
  id: number;

  @Field()
  value: boolean;
}

@Resolver()
export class EditPostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => [GetPostsResultUnion])
  async updatePostLikes(@Arg("data") { id, value, postType }: LikeInput) {
    // add or remove likes from a specific post, cannot be less than 0
    let post;

    const entity =
      postType === "track"
        ? TrackPost
        : postType === "album"
        ? AlbumPost
        : postType === "artist"
        ? ArtistPost
        : null;

    if (!entity) {
      return null;
    }

    const query = createQueryBuilder()
      .update(entity)
      .where("id = :id", { id: id });

    if (value) {
      await query
        .set({
          likes: () => "likes + 1",
        })
        .execute();
    } else {
      post = await entity.findOne(id);
      if (post?.likes! > 0) {
        await query
          .set({
            likes: () => "likes - 1",
          })
          .execute();
      }
    }
    post = await entity.findOne(id);
    return [post];
  }
}
