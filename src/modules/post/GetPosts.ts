import { Arg, createUnionType, Query, Resolver } from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/User";

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
  // @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async getPosts() {
    // return all posts in the db
    const artists = await ArtistPost.find({ relations: ["user"] });
    const albums = await AlbumPost.find({ relations: ["user"] });
    const tracks = await TrackPost.find({ relations: ["user"] });

    return [...artists, ...albums, ...tracks];
  }

  // @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async getUserPosts(@Arg("id") id: number) {
    // get posts by user id

    const albumPosts = await createQueryBuilder()
      .relation(User, "albumPost")
      .of(id)
      .loadMany();

    const artistPosts = await createQueryBuilder()
      .relation(User, "artistPost")
      .of(id)
      .loadMany();

    const trackPosts = await createQueryBuilder()
      .relation(User, "trackPost")
      .of(id)
      .loadMany();

    return [...albumPosts, ...artistPosts, ...trackPosts];
  }

  @Query(() => [ArtistPost])
  async getArtistPosts(@Arg("id") id: string) {
    const artists = await ArtistPost.find({
      relations: ["user"],
      where: { artistId: id },
    });

    return [...artists];
  }

  @Query(() => [AlbumPost])
  async getAlbumPosts(@Arg("id") id: string) {
    const albums = await AlbumPost.find({
      relations: ["user"],
      where: { albumId: id },
    });
    return [...albums];
  }

  @Query(() => [TrackPost])
  async getTrackPosts(@Arg("id") id: string) {
    const tracks = await TrackPost.find({
      relations: ["user"],
      where: { trackId: id },
    });

    return [...tracks];
  }
}
