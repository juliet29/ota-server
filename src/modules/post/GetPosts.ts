import { Resolver, Query } from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { Post } from "../../entity/Post";
import { getSpotifyAccessToken } from "../../utils-global/spotifyToken";

@Resolver()
export class GetPostsResolver {
  // return all the Posts in the db
  // @UseMiddleware(isAuth)
  @Query(() => [Post])
  async getPosts() {
    console.log("do i have a secret", getSpotifyAccessToken());
    return Post.find({ relations: ["user"] });
  }
}
