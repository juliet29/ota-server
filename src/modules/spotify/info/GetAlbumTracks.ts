import { Query, Resolver, Arg, Ctx, ObjectType, Field } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { Track } from "../search/SearchTypes";

@ObjectType()
export class AlbumTracks {
  @Field(() => [AlbumTrackItem])
  items: AlbumTrackItem[];
}

@ObjectType()
export class AlbumTrackItem extends Track {
  @Field()
  track_number?: number;

  @Field()
  preview_url?: string;
}

@Resolver()
export class GetAlbumTracksResolver {
  @Query(() => AlbumTracks)
  async getAlbumTracks(@Arg("id") id: string, @Ctx() ctx: MyContext) {
    return await ctx.dataSources?.SpotifyAPI.getAlbumTracks(id);
  }
}
