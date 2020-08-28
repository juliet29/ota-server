import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "src/types/MyContext";
import {
  Arg,
  createUnionType,
  Ctx,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { createQueryBuilder, SelectQueryBuilder } from "typeorm";
// import { isAuth } from "../middleware/isAuth";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { Playlist } from "../../entity/Playlist";
import { Poll } from "../../entity/Poll";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

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

    const types = ["AlbumPost", "ArtistPost", "TrackPost", "Poll", "Playlist"];
    const ids = user.following;
    const queries = types.map((type) => {
      const typeUser = type.concat(".user");
      return createQueryBuilder(type).leftJoinAndSelect(typeUser, "user");
    });

    // get all post types
    const exQueryForUser = async (k: number) => {
      const getAllPosts = async (
        query: SelectQueryBuilder<any>,
        id: number
      ) => {
        return await query.where("user.id = :id", { id }).getMany();
      };

      const resolvePosts = async () => {
        return Promise.all(queries.map((i) => getAllPosts(i, k)));
      };
      const allPosts = resolvePosts().then((d) => {
        const joinPostsArray: any[] = [];
        d.forEach((i) => i.forEach((k) => joinPostsArray.push(k)));
        return joinPostsArray;
      });

      return allPosts;
    };

    // get posts from everyone being followed
    const getData = async () => {
      return Promise.all(ids.map(async (id) => await exQueryForUser(id)));
    };

    const posts = await getData().then((data) => {
      // console.log("\n data", data, "\n");
      const joinPostsArray: any[] = [];
      data.forEach((i) => i.forEach((k) => joinPostsArray.push(k)));

      return joinPostsArray;
    });

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
