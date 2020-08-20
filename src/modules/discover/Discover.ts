import { AuthenticationError } from "apollo-server-express";
import {
  createUnionType,
  Ctx,
  Field,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MoreThan, MoreThanOrEqual } from "typeorm";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { Playlist } from "../../entity/Playlist";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";
import { Track } from "../spotify/search/SearchTypes";

@ObjectType()
export class Reccomendation {
  @Field(() => [Track])
  tracks: Track[];
}

export const GetContentPostsResultUnion = createUnionType({
  name: "GetContentPostsResult",
  types: () => [AlbumPost, ArtistPost, TrackPost] as const,
  resolveType: (value: any) => {
    if ("albumId" in value) {
      return AlbumPost;
    }
    if ("trackId" in value) {
      return TrackPost;
    }
    if ("artistId" in value) {
      return ArtistPost;
    }
    return null;
  },
});

@Resolver()
export class DiscoverResolver {
  @Query(() => [GetContentPostsResultUnion])
  async getTopPosts() {
    const minLikes = MoreThan(1);
    // get all posts w more than 1 like
    const artists = await ArtistPost.find({
      where: [{ likes: minLikes }],
      relations: ["user"],
    });
    const albums = await AlbumPost.find({
      where: [{ likes: minLikes }],
      relations: ["user"],
    });
    const tracks = await TrackPost.find({
      where: [{ likes: minLikes }],
      relations: ["user"],
    });

    // find the top 10 among those
    const content = [...artists, ...albums, ...tracks];
    // content.sort((a, b) => b.likes! - a.likes!);

    const bestContent = content
      .sort((a, b) => b.likes! - a.likes!)
      .slice(0, 10)
      .map((i) => i);

    return bestContent;
  }

  @Query(() => [Playlist])
  async getTopPlaylists() {
    const minLikes = MoreThanOrEqual(1);

    const playlists = await Playlist.find({
      where: [{ likes: minLikes }],
      relations: ["user"],
    });

    // find the top 10 among those
    const content = [...playlists];

    const bestContent = content
      .sort((a, b) => b.likes! - a.likes!)
      .slice(0, 10)
      .map((i) => i);

    return bestContent;
  }

  @Query(() => [ArtistPost])
  async getTopArtists() {
    const minLikes = MoreThanOrEqual(1);

    const artists = await ArtistPost.find({
      where: [{ likes: minLikes }],
      relations: ["user"],
    });

    // find the top 10 among those
    const content = [...artists];

    const bestContent = content
      .sort((a, b) => b.likes! - a.likes!)
      .slice(0, 10)
      .map((i) => i);

    return bestContent;
  }

  @UseMiddleware(isAuth)
  @Query(() => Reccomendation, { nullable: true })
  async getReccomendations(@Ctx() ctx: MyContext) {
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // get genre list
    const userGenres = user.genres.length > 1 ? user.genres : "pop";
    const genreList = encodeURIComponent(userGenres.toString());

    return await ctx.dataSources?.SpotifyAPI.getReccomendations(genreList);
  }
}
