import { AuthenticationError } from "apollo-server-express";
import { nanoid } from "nanoid";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { DirectMessage } from "../../entity/DirectMessage";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";

@InputType()
export class DirectMessageInput {
  @Field()
  recipientID?: number;

  @Field()
  text?: string;

  @Field()
  partnerID?: number;

  // @Field(() => GetPostsResultUnion)
  // content?: typeof GetPostsResultUnion;
}

@Resolver()
export class HandleDirectMessageResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => DirectMessage)
  async sendNewDM(
    @Arg("data")
    { text, recipientID }: DirectMessageInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    let recipient = await User.findOne(recipientID);
    let sender = user;
    let conversationID: string;
    // see if a chat history exists between two users

    const recievedDM = await DirectMessage.findOne({
      where: { recipient: user.id, sender: recipientID },
    });

    const sentDM = await DirectMessage.findOne({
      where: { recipient: recipientID, sender: user.id },
    });

    console.log("\n rec dms", recievedDM, "\n send dms", sentDM);

    conversationID = recievedDM
      ? recievedDM.conversationID
      : sentDM
      ? sentDM.conversationID
      : nanoid();

    let newDM: DirectMessage;

    try {
      newDM = await DirectMessage.create({
        text,
        recipient,
        sender,
        conversationID,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newDM;
  }

  @UseMiddleware(isAuth)
  @Query(() => [DirectMessage])
  async getMyDMs(@Ctx() ctx: MyContext) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    const myDMs = await DirectMessage.find({
      relations: ["sender", "recipient"],
      where: [{ recipient: user.id }, { sender: user.id }],
    });

    // only return unique convos

    const flags = new Set();
    const myUniqueDMs = myDMs.filter((entry) => {
      if (flags.has(entry.conversationID)) {
        return false;
      }
      flags.add(entry.conversationID);
      return true;
    });

    return myUniqueDMs;
  }

  @UseMiddleware(isAuth)
  @Query(() => [DirectMessage])
  async getMyDMChat(
    @Arg("data")
    { partnerID }: DirectMessageInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    const recievedDMs = await DirectMessage.find({
      relations: ["sender", "recipient"],
      where: { recipient: user.id, sender: partnerID },
    });

    const sentDMs = await DirectMessage.find({
      relations: ["sender", "recipient"],
      where: { recipient: partnerID, sender: user.id },
    });
    return [...sentDMs, ...recievedDMs];
  }
}
