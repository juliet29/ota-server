import {
  Resolver,
  Query,
  createUnionType,
  // ObjectType,
  // Field,
} from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { ArtistPost, AlbumPost, TrackPost } from "../../entity/ContentPosts";

const GetPostsResultUnion = createUnionType({
  name: "GetPostsResult",
  types: () => [AlbumPost, ArtistPost, TrackPost] as const,
  resolveType: (value) => {
    if ("albumId" in value) {
      return AlbumPost;
    }
    if ("trackId" in value) {
      return TrackPost;
    }

    return ArtistPost;
  },
});

@Resolver()
export class GetPostsResolver {
  // return all the Posts in the db
  // @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async getPosts() {
    const artists = await ArtistPost.find({ relations: ["user"] });
    const albums = await AlbumPost.find({ relations: ["user"] });
    const tracks = await TrackPost.find({ relations: ["user"] });

    return [...artists, ...albums, ...tracks];
  }
}
