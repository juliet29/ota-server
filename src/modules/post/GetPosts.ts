import { Resolver, UseMiddleware, Query } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Post } from "../../entity/Post";

@Resolver()
export class GetPostsResolver {
  // return all the Posts in the db
  @UseMiddleware(isAuth)
  @Query(() => [Post])
  async getPosts() {
    return Post.find({ relations: ["user"] });
  }
}
