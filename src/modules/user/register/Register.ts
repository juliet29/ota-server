import bcrypt from "bcryptjs";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { isAuth } from "../../../modules/middleware/isAuth";
import { RegisterInput, FacebookRegisterInput } from "./RegisterInput";
import { User } from "../../../entity/User";
import { getRepository } from "typeorm";
import { sendRefreshToken } from "../../../global-utils/sendRefreshToken";
import {
  createRefreshToken,
  createAccessToken,
} from "../../../global-utils/auth";
import { MyContext } from "../../../types/MyContext";
import { LoginResponse } from "../current-user/Login";

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

  // TODO: reconcile differences between fb usernae and regular name
  @Mutation(() => LoginResponse)
  async facebookRegisterAndLogIn(
    @Arg("data") { id, username, email }: FacebookRegisterInput,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse | null> {
    // see if there is a user w this id is in the db
    const query = getRepository(User)
      .createQueryBuilder("user")
      .where("user.facebookId = :facebookId", { facebookId: id });

    // conditionally see if this email exists in the db
    // if (email) {

    // }
    query.orWhere("user.email = :email", { email });

    let user = await query.getOne();

    if (!user) {
      // this user needs to be registered
      user = await User.create({
        username,
        email,
        facebookId: id,
      }).save();
    } else if (!user.facebookId) {
      // merge account
      // we found user by email -> never clicked on sign in w FB, but do have account
      user.facebookId = id;
      await user.save();
    } else {
      // we have a facebookId
      // login
    }

    console.log(user);

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };

    // TODO: login with the new user

    // // send email to confirm
    // await sendEmail(email, await createConfirmationUrl(user.id));
  }
}
