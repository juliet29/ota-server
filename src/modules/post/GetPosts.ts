import { Arg, createUnionType, Query, Resolver } from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/User";
import { Poll } from "../../entity/Poll";
import { Playlist } from "../../entity/Playlist";

export const GetPostsResultUnion = createUnionType({
  name: "GetPostsResult",
  types: () => [AlbumPost, ArtistPost, TrackPost, Poll, Playlist] as const,
  resolveType: (value) => {
    if ("albumId" in value) {
      return AlbumPost;
    }
    if ("trackId" in value) {
      return TrackPost;
    }
    if ("artistId" in value) {
      return ArtistPost;
    }
    if ("playlistPicture" in value) {
      return Playlist;
    }

    return Poll;
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
    const polls = await Poll.find({ relations: ["user"] });
    const playlists = await Playlist.find({ relations: ["user"] });

    return [...artists, ...albums, ...tracks, ...polls, ...playlists];
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

    const polls = await createQueryBuilder()
      .relation(User, "poll")
      .of(id)
      .loadMany();

    const playlists = await createQueryBuilder()
      .relation(User, "playlist")
      .of(id)
      .loadMany();

    console.log("playlists", playlists);

    return [
      ...albumPosts,
      ...artistPosts,
      ...trackPosts,
      ...polls,
      ...playlists,
    ];
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
