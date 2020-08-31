import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Comment } from "../../entity/Comment";
import { isAuth } from "../middleware/isAuth";
import { LikeInput } from "../post/EditPost";

@Resolver()
export class EditCommentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async updateCommentLikes(@Arg("data") { id, value }: LikeInput) {
    // get the comment by id
    let comment;

    const query = createQueryBuilder()
      .update(Comment)
      .where("id = :id", { id: id });

    if (value) {
      await query
        .set({
          likes: () => "likes + 1",
        })
        .execute();
    } else {
      comment = await Comment.findOne(id);
      if (comment?.likes! > 0) {
        await query
          .set({
            likes: () => "likes - 1",
          })
          .execute();
      }
    }
    comment = await Comment.findOne(id);

    return comment;
  }
}
