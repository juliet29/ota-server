import bcrypt from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../modules/middleware/isAuth";
import { RegisterInput } from "./RegisterInput";
import { User } from "../../../entity/User";

// import { createConfirmationUrl } from "../utils/createConfirmationUrl";

@Resolver()
export class RegisterResolver {
  // have to be authenticated to do this query
  // just a simple check
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("data") { username, email, password }: RegisterInput
  ): Promise<Boolean> {
    // user's input is validated before hand in userInput.ts

    // hash the users password
    const hashedPassowrd = await bcrypt.hash(password, 12);

    // save the user into the database
    // const user =
    await User.create({
      username,
      email,
      password: hashedPassowrd,
    }).save();

    // // send email to confirm
    // await sendEmail(email, await createConfirmationUrl(user.id));

    return true;
  }
}
