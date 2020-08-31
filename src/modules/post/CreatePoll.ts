import { AuthenticationError } from "apollo-server-express";
import { Poll, PollOption } from "../../entity/Poll";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";

// @ObjectType()
// @InputType("PollOptionInput")
// export class PollOption extends BaseEntity {
//   @Field()
//   option: string;

//   @Field()
//   votes: number;
// }

@InputType()
export class PollInput {
  @Field()
  question?: string;

  @Field()
  length?: number;

  @Field(() => [PollOption])
  options?: PollOption[];

  @Field()
  id?: number;
}

@Resolver()
export class CreatePollResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Poll)
  async createPoll(
    @Arg("data")
    { question, length, options }: PollInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    let newPoll: Poll;
    const likes = 0;
    try {
      newPoll = await Poll.create({
        question,
        length,
        options,
        likes,
        user,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPoll;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Poll)
  async updatePoll(
    @Arg("data")
    { id, options }: PollInput,
    @Ctx() ctx: MyContext
  ) {
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // need to pass in a whole new options array, and that will be overwritten in the db
    if (id) {
      await Poll.update(id, {
        options,
      });
      return await Poll.findOne(id);
    }
    // Poll not found bc id not provided
    return null;
  }
}
