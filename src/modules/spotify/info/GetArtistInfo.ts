import { Arg, Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { Album, Track } from "../search/SearchTypes";

@ObjectType()
export class ArtistTopTracks {
  @Field(() => [ArtistTopTrackItem])
  tracks: ArtistTopTrackItem[];
}

@ObjectType()
export class ArtistTopTrackItem extends Track {
  @Field()
  is_playable?: boolean;

  @Field()
  preview_url?: string;
}

@ObjectType()
export class ArtistAlbums {
  @Field(() => [Album])
  items: Album[];
}

@Resolver()
export class GetArtistAlbumsResolver {
  @Query(() => ArtistAlbums)
  async getArtistAlbums(@Arg("id") id: string, @Ctx() ctx: MyContext) {
    return await ctx.dataSources?.SpotifyAPI.getArtistAlbums(id);
  }

  @Query(() => ArtistTopTracks)
  async getArtistTopTracks(@Arg("id") id: string, @Ctx() ctx: MyContext) {
    return await ctx.dataSources?.SpotifyAPI.getArtistTopTracks(id);
  }
}
