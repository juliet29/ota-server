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

let attempt: number = 0;

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

  // GET FOLLOWERS OF A USER
  @Query(() => [User])
  async getFollowers(@Arg("id") id: number) {
    // get followers of user to be followed or unfollowrd
    const followers = (await User.findOne(id))?.followers;
    console.log("followers", followers);
    if (followers) {
      const followerProfiles = await User.findByIds(followers);
      return followerProfiles;
    }

    return null;
  }

  // GET USERS THAT THE CURRENT USER FOLLOWS...
  @Query(() => [User])
  async getFollowingorFollowers(
    @Arg("id") id: number,
    @Arg("request") request: "followers" | "following"
  ) {
    if (request == "followers") {
      const followers = (await User.findOne(id))?.followers;
      console.log("followers", followers);
      if (followers) {
        const followerProfiles = await User.findByIds(followers);
        return followerProfiles;
      }
    }

    if (request == "following") {
      const following = (await User.findOne(id))?.following;
      console.log("followers", following);
      if (following) {
        const followingProfiles = await User.findByIds(following);
        return followingProfiles;
      }
    }

    return null;
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

    // query builders
    const query = createQueryBuilder()
      .update(User)
      .where("id = :id", { id: id });

    const queryCurrentUser = createQueryBuilder()
      .update(User)
      .where("id = :id", { id: currentUser.id });

    // info about the other user
    const existingFollowers = (await User.findOne(id))?.followers;
    const alreadyFollowing = existingFollowers
      ?.toString()
      .includes(currentUser?.id.toString());

    // sanity checks
    attempt++;
    console.log("\n");
    console.log(
      `who is the current user? ${currentUser.id} who are they trying to follow ${id}`
    );
    console.log(
      `attempt #${attempt}: alreadyFollowing is ${alreadyFollowing}, and current user wants to follow is ${follow}`
    );
    console.log(`who is the current user following? ${currentUser.following}`);
    console.log("\n");

    // want to follow user and not already following
    if (!alreadyFollowing && follow) {
      console.log(
        "TRYING TO FOLLOW -> existing followers are",
        existingFollowers
      );
      console.log(`user to b followed id: ${id}, time: ${Date()}`);
      console.log("\n");

      try {
        // update followers of other user
        existingFollowers!?.length >= 1
          ? query.set({ followers: [existingFollowers, currentUser.id] })
          : query.set({ followers: [currentUser.id] });

        // update current user's following if needed
        if (!currentUser.following.toString().includes(id.toString())) {
          console.log("hello, current user's following updatted");
          currentUser.following!?.length >= 1
            ? queryCurrentUser.set({ following: [currentUser.following, id] })
            : queryCurrentUser.set({ following: [id] });
        }

        // execute querries
        await query.execute();
        await queryCurrentUser.execute();

        // return update info other user
        return await User.findOne(id);
      } catch (err) {
        throw new Error(err);
      }
    }

    // already following and want to follow
    if (alreadyFollowing && follow) {
      // just retrun the user w no changes
      console.log("this is a refollow! \n");
      return await User.findOne(id);
    }

    // request to unfollow user
    if (!follow) {
      console.log(
        "TRYING TO UNFOLLOW -> existing followers are",
        existingFollowers
      );
      console.log(`user to b followed id: ${id}, time: ${Date()}`);
      console.log("\n");

      // update unfollowers of other user
      const unfollowed = existingFollowers?.filter(
        (el) => el != currentUser.id
      );
      const unfollowing = currentUser.following?.filter((el) => el != id);
      try {
        // set and execute
        await query.set({ followers: [unfollowed] }).execute();
        // return updated user info
        await queryCurrentUser.set({ following: [unfollowing] }).execute();
        return await User.findOne(id);
      } catch (err) {
        throw new Error(err);
      }
    }

    // if we get here there is an issue or want to re-follow

    console.log(`this is probs an error`);
    console.log("\n");
    return null;
  }

  //end of resolver
}
