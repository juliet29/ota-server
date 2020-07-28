import { Arg, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { GetPostsResultUnion } from "./GetPosts";

@Resolver()
export class SearchPostResolver {
  //   @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async searchPosts(@Arg("query") query: String) {
    // ------------  search track posts
    let trackQB = getConnection()
      .getRepository(TrackPost)
      .createQueryBuilder("l");

    trackQB.orWhere("l.trackName ilike :trackName", {
      trackName: `%${query}%`,
    });

    // trackQB.orWhere("l.text ilike :text", {
    //   text: `%${query}%`,
    // });

    trackQB.orWhere("l.artistNames ilike :artistNames", {
      artistNames: `%${query}%`,
    });

    // ------------ search album posts
    let albumQB = getConnection()
      .getRepository(AlbumPost)
      .createQueryBuilder("l");

    albumQB.orWhere("l.albumName ilike :albumName", {
      albumName: `%${query}%`,
    });

    // albumQB.orWhere("l.text ilike :text", {
    //   text: `%${query}%`,
    // });

    albumQB.orWhere("l.artistNames ilike :artistNames", {
      artistNames: `%${query}%`,
    });

    // ------------ search artist posts
    let artistQB = getConnection()
      .getRepository(ArtistPost)
      .createQueryBuilder("l");

    artistQB.orWhere("l.artistName ilike :artistName", {
      artistName: `%${query}%`,
    });

    // artistQB.orWhere("l.text ilike :text", {
    //   text: `%${query}%`,
    // });

    const tracks = await trackQB.getMany();
    const albums = await albumQB.getMany();
    const artists = await artistQB.getMany();

    return [...tracks, ...albums, ...artists];
  }

  //end of resolver
}
