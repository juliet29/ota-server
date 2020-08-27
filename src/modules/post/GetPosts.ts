import {
  Arg,
  createUnionType,
  Query,
  Resolver,
  UseMiddleware,
  Ctx,
} from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/User";
import { Poll } from "../../entity/Poll";
import { Playlist } from "../../entity/Playlist";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types/MyContext";
import { AuthenticationError } from "apollo-server-express";

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

  @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async getPostsOfFollowing(@Ctx() ctx: MyContext) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const query = createQueryBuilder().relation(User, "albumPost");

    // get posts based on id of people this user follows
    const exQuery = async (k: number) => {
      return await query.of(k).loadMany();
    };

    const ids = [17, 19];

    const getData = async () => {
      return Promise.all(ids.map(async (i) => exQuery(i)));
    };
    // let allPosts: any[] = [];
    const posts = await getData().then((data) => {
      // const newData = data.map((i) => Object.values(i));
      const hello: any[] = [];
      data.forEach((i) => i.forEach((k) => hello.push(k)));
      console.log("\n ALL posts", hello, "\n");
      return hello;
    });

    // console.log("\n ALL posts", posts, "\n");

    return [...posts];
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
