import { Resolver, Query } from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { BasePost } from "../../entity/BasePost";
import { getSpotifyAccessToken } from "../../utils-global/spotifyToken";

@Resolver()
export class GetPostsResolver {
  // return all the Posts in the db
  // @UseMiddleware(isAuth)
  @Query(() => [BasePost])
  async getPosts() {
    console.log("do i have a secret", getSpotifyAccessToken());
    return BasePost.find({ relations: ["user"] });
  }
}
