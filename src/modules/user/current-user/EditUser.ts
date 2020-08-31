import {
  UseMiddleware,
  Resolver,
  Arg,
  Ctx,
  InputType,
  Field,
  Mutation,
} from "type-graphql";
import { isAuth } from "../../../modules/middleware/isAuth";
import { User } from "../../../entity/User";
import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "../../../types/MyContext";

@InputType()
export class EditUserInput {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field(() => [String])
  genres?: string[];
}

@Resolver()
export class EditUserResolver {
  // update current user's name and/or username
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async editUserNames(
    @Arg("data") { name, username }: EditUserInput,
    @Ctx() ctx: MyContext
  ) {
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    try {
      await User.update(user.id, {
        name,
        username,
      });
    } catch (err) {
      throw new Error(`user not updated" ${err}`);
    }

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async editUserGenres(
    @Arg("data") { genres }: EditUserInput,
    @Ctx() ctx: MyContext
  ) {
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    try {
      await User.update(user.id, {
        genres,
      });
    } catch (err) {
      throw new Error(`user not updated" ${err}`);
    }

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async editFirstLogin(@Ctx() ctx: MyContext) {
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    try {
      await User.update(user.id, {
        firstLogin: false,
      });
      return true;
    } catch (err) {
      throw new Error(`user not updated" ${err}`);
    }
  }

  // -------------
  // end of resolver
}
