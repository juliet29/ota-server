import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "src/types/MyContext";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { createQueryBuilder, getConnection } from "typeorm";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class OtherUserResolver {
  // GET OTHER USER
  @Query(() => User)
  async getOtherUser(@Arg("id") id: number) {
    return User.findOne(id);
  }

  // SEARCH USERS
  @Query(() => [User])
  async searchUser(@Arg("query") query: String) {
    let userQB = getConnection().getRepository(User).createQueryBuilder("l");

    userQB.orWhere("l.username ilike :username", {
      username: `%${query}%`,
    });

    return userQB.getMany();
  }

  // FOLLOW/UNFOLLOW OTHER USERS
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async followOtherUser(
    @Arg("id") id: number,
    @Arg("follow") follow: boolean,
    @Ctx() ctx: MyContext
  ) {
    // get current user
    const currentUser = await User.findOne(ctx.payload?.userId)!;
    if (!currentUser) {
      throw new AuthenticationError("User not found");
    }

    // get followers of user to be followed or unfollowrd
    const existingFollowers = (await User.findOne(id))?.followers;

    const query = createQueryBuilder()
      .update(User)
      .where("id = :id", { id: id });

    // request to follow user that isn't already followed
    const alreadyFollowing = existingFollowers
      ?.toString()
      .includes(currentUser?.id.toString());

    if (!alreadyFollowing && follow) {
      console.log("TRYING TO FOLLOW", existingFollowers);
      console.log(`user id: ${id}, time: ${Date()}`);
      try {
        existingFollowers!?.length > 1
          ? query
              .set({
                followers: [existingFollowers, currentUser.id],
              })
              .execute()
          : query
              .set({
                // no existing followers
                followers: [currentUser.id],
              })
              .execute();
      } catch (err) {
        throw new Error(err);
      }
    }

    // request to unfollow user
    if (!follow) {
      console.log("TRYING TO UNFOLLOW", existingFollowers);
      console.log(`user id: ${id}, time: ${Date()}`);
      const unfollowed = existingFollowers?.filter(
        (el) => el != currentUser.id
      );
      try {
        query
          .set({
            followers: [unfollowed],
          })
          .execute();
      } catch (err) {
        throw new Error(err);
      }
    }

    return await User.findOne(id);
  }

  //end of resolver
}
