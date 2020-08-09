import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "../../types/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
  ObjectType,
} from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";
import { BaseEntity } from "typeorm";

@ObjectType()
export class TopFive extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  imageUrl?: string;

  @Field(() => [String])
  artistNames?: string[];
}

@InputType()
export class TopFiveInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field(() => [String])
  artistNames?: string[];
}

@InputType()
export class TopFiveArrayInput {
  @Field(() => [TopFiveInput])
  dataArray: TopFiveInput[];

  @Field()
  type: string;
}

@Resolver()
export class UseTopFiveResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async updateUserTopFive(
    @Arg("data") { dataArray, type }: TopFiveArrayInput,
    @Ctx() ctx: MyContext
  ) {
    const currentUser = await User.findOne(ctx.payload?.userId)!;
    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }
    console.log("dataArray in user5", dataArray);
    // json = dataArray
    try {
      type === "track"
        ? await User.update(currentUser.id, {
            topTracks: dataArray,
          })
        : type === "artist"
        ? await User.update(currentUser.id, {
            topArtists: dataArray,
          })
        : type === "album"
        ? await User.update(currentUser.id, {
            topAlbums: dataArray,
          })
        : null;
    } catch (err) {
      console.log("err in user top five server", err);
    }

    return await User.findOne(ctx.payload?.userId);
  }

  //end of resolver
}
