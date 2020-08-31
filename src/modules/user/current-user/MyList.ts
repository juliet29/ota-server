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

const shallowEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};

@Resolver()
export class MyListResolver {
  // GET POSTS IN MY LIST
  @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
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

      post = await entity.findOne(postId, { relations: ["user"] });
      if (!post) {
        return;
      }
      return post;
    });
    return myListPosts;
  }

  // ADD POSTS
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
    const newListItem = { postId, postType };

    // only add if not already existing
    const existingList = currentUser.myList;

    const alreadyInList = existingList
      .map((el) => {
        if (shallowEqual(el, newListItem)) {
          return true;
        }

        return false;
      })
      .includes(true);

    // console.log(
    //   "\n in my list",
    //   alreadyInList,
    //   "\n",
    //   existingList,
    //   "\n",
    //   newListItem
    // );

    if (!alreadyInList) {
      const list = [...existingList, newListItem];

      const query = createQueryBuilder()
        .update(User)
        .where("id = :id", { id: currentUser.id });

      await query.set({ myList: list }).execute();
    }

    return await User.findOne(ctx.payload?.userId)!;
  }

  // REMOVE POSTS
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async removeFromMyList(
    @Arg("data") { postId, postType }: MyListInput,
    @Ctx() ctx: MyContext
  ) {
    // get current user
    const currentUser = await User.findOne(ctx.payload?.userId)!;
    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }
    const listItem = { postId, postType };

    // only remove if not already existing
    const existingList = currentUser.myList;

    const alreadyInList = existingList
      .map((el) => {
        if (shallowEqual(el, listItem)) {
          return true;
        }

        return false;
      })
      .includes(true);

    if (alreadyInList) {
      // console.log(
      //   "\n in my list, going to remove",
      //   alreadyInList,
      //   "\n",
      //   existingList,
      //   "\n",
      //   listItem
      // );
      const list = existingList.filter((el) => !shallowEqual(el, listItem));
      console.log("\n list new", list);
      console.log("\n list current", existingList);

      const query = createQueryBuilder()
        .update(User)
        .where("id = :id", { id: currentUser.id });

      await query.set({ myList: list }).execute();
      return await User.findOne(ctx.payload?.userId)!;
    }

    // console.log(
    //   "\n not in my list, not going to remove",
    //   alreadyInList,
    //   "\n",
    //   existingList,
    //   "\n",
    //   listItem
    // );

    return await User.findOne(ctx.payload?.userId)!;
  }

  //end of resolver
}
