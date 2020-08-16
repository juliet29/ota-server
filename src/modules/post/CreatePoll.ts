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
  question: string;

  @Field()
  length: number;

  @Field(() => [PollOption])
  options: PollOption[];
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
    console.log(ctx);

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
}
