import { AuthenticationError } from "apollo-server-express";
import { AlbumPost, ArtistPost, TrackPost } from "../../../entity/ContentPosts";
import { Playlist } from "../../../entity/Playlist";
import { GetPostsResultUnion } from "../../../modules/post/GetPosts";
import { MyContext } from "../../../types/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { BaseEntity, createQueryBuilder } from "typeorm";
import { User } from "../../../entity/User";
import { isAuth } from "../../../modules/middleware/isAuth";

// import { Resolver, ObjectType, Field, InputType } from "type-graphql";
// import { BaseEntity } from "typeorm";

@ObjectType()
export class MyListItem extends BaseEntity {
  @Field()
  postId: number;

  @Field()
  postType: string;
}

@InputType()
export class MyListInput {
  @Field()
  postId: number;

  @Field()
  postType: string;
}

@Resolver()
export class MyListResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async addToMyList(
    @Arg("data") { postId, postType }: MyListInput,
    @Ctx() ctx: MyContext
  ) {
    // get current user
    const currentUser = await User.findOne(ctx.payload?.userId)!;
    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }

    const list = [...currentUser.myList, { postId, postType }];

    const query = createQueryBuilder()
      .update(User)
      .where("id = :id", { id: currentUser.id });

    await query.set({ myList: list }).execute();

    return await User.findOne(ctx.payload?.userId)!;
  }

  @Query(() => [GetPostsResultUnion]) //maybe for query...
  async getMyList(@Ctx() ctx: MyContext) {
    const currentUser = await User.findOne(ctx.payload?.userId)!;
    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }

    // find the post
    const myListPosts = currentUser.myList.map(async ({ postId, postType }) => {
      let post;
      const entity =
        postType === "track"
          ? TrackPost
          : postType === "album"
          ? AlbumPost
          : postType === "artist"
          ? ArtistPost
          : postType === "playlist"
          ? Playlist
          : null;

      if (!entity) {
        return null;
      }

      post = await entity.findOne(postId);
      return post;
    });

    return myListPosts;
  }

  //end of resolver
}
