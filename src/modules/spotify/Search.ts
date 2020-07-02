import { Artist, Track } from "../../entity/Artist";
import { Query, Resolver, Arg, Ctx, ObjectType, Field } from "type-graphql";
import { MyContext } from "src/types/MyContext";
import { createUnionType } from "type-graphql";

@ObjectType()
class ArtistItems {
  @Field(() => [Artist])
  items: Artist[];
}

@ObjectType()
class TrackItems {
  @Field(() => [Track])
  items: Track[];
}

@ObjectType()
class ArtistSearchResult {
  @Field({ nullable: true })
  artists: ArtistItems;
}

@ObjectType()
class TrackSearchResult {
  @Field()
  tracks: TrackItems;
}

const SearchResultUnion = createUnionType({
  name: "SearchResult", // the name of the GraphQL union
  types: () => [TrackSearchResult, ArtistSearchResult] as const, // function that returns tuple of object types classes

  resolveType: (value) => {
    if ("tracks" in value) {
      return TrackSearchResult; // we can return object type class (the one with `@ObjectType()`)
    }

    return ArtistSearchResult; // or the schema name of the type as a string
  },
});

@Resolver()
export class SearchResolver {
  // TODO
  @Query(() => SearchResultUnion, { nullable: true })
  search(
    @Arg("query") query: string,
    @Arg("type") type: string,
    @Ctx() ctx: MyContext //   (_: any, { id }: any, { dataSources }: any)
  ) {
    //TODO remove duplicates

    return ctx.dataSources?.SpotifyAPI.search(encodeURIComponent(query), type);

    // const tracks = await ctx.dataSources?.SpotifyAPI.search(
    //   encodeURIComponent(query),
    //   type
    // );
  }
}
