import { Artist } from "../../entity/Artist";
import { Query, Resolver, Arg, Ctx, ObjectType, Field } from "type-graphql";
import { MyContext } from "src/types/MyContext";

@ObjectType()
class Items {
  @Field(() => [Artist])
  items: Artist[];
}

@ObjectType()
class SearchResult {
  @Field()
  artists: Items;
}

@Resolver()
export class SearchResolver {
  // TODO
  @Query(() => SearchResult, { nullable: true })
  search(
    @Arg("query") query: string,
    @Arg("type") type: string,
    @Ctx() ctx: MyContext //   (_: any, { id }: any, { dataSources }: any)
  ) {
    //TODO remove duplicates
    return ctx.dataSources?.SpotifyAPI.search(encodeURIComponent(query), type);
  }
}
