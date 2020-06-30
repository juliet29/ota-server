import { Artist } from "../../entity/Artist";
import { Query, Resolver, Arg, Ctx } from "type-graphql";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class GetArtistResolver {
  @Query(() => Artist, { nullable: true })
  getArtist(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext //   (_: any, { id }: any, { dataSources }: any)
  ) {
    return ctx.dataSources?.SpotifyAPI.getArtist(id);
  }
}
