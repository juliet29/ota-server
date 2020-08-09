import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";

// @ObjectType()
// export class ArtistTopTracks {
//   @Field(() => [ArtistTopTrackItem])
//   tracks: ArtistTopTrackItem[];
// }

// @ObjectType()
// export class ArtistTopTrackItem extends Track {
//   @Field()
//   is_playable?: boolean;

//   @Field()
//   preview_url?: string;
// }

@ObjectType()
export class GenreList {
  @Field(() => [String])
  genres: String[];
}

@Resolver()
export class GenresResolver {
  @Query(() => GenreList)
  async getGenres(@Ctx() ctx: MyContext) {
    return await ctx.dataSources?.SpotifyAPI.getGenreSeeds();
  }

  // --- end of resolver
}
