import { MyContext } from "src/types/MyContext";
import { Arg, createUnionType, Ctx, Query, Resolver } from "type-graphql";
import { ArtistSearchResult, TrackSearchResult } from "./SearchTypes";

// create union of search results
const SearchResultUnion = createUnionType({
  name: "SearchResult",
  types: () => [TrackSearchResult, ArtistSearchResult] as const,

  resolveType: (value) => {
    if ("tracks" in value) {
      return TrackSearchResult;
    }

    return ArtistSearchResult;
  },
});

@Resolver()
export class SearchResolver {
  // TODO
  @Query(() => SearchResultUnion, { nullable: true })
  search(
    @Arg("query") query: string,
    @Arg("type") type: string,
    @Ctx() ctx: MyContext
  ) {
    return ctx.dataSources?.SpotifyAPI.search(encodeURIComponent(query), type);
  }
}
