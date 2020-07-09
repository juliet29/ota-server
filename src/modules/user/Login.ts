import { Resolver, Mutation, Arg, Ctx, ObjectType, Field } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { sendRefreshToken } from "../../utils-global/sendRefreshToken";
import { createRefreshToken, createAccessToken } from "../../utils-global/auth";
import { MyContext } from "../../types/MyContext";
// import { MyContext } from "../../types/MyContext";
// import { GraphQLError } from "graphql";

// TODO move responses/input types
@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse | null> {
    // search for the user in the database based on their emal
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("could not find user");
      throw new Error("could not find user");
    }

    // // if we find the user, compare the passwords entered
    const valid = await bcrypt.compare(password, user.password);
    // console.log(password);
    // const valid = true;

    if (!valid) {
      console.log("password not valid");
      throw new Error("bad password");
    }

    if (!user.confirmed) {
      console.log("you need to confirm your email");
      throw new Error("user not confirmed");
    }

    // login succesful

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
    // return user;

    // // give the user a session if everything is good
    // ctx.req.session!.userId = user.id;

    // console.log(`hi im a redis ${ctx.req.session!.userId}`);
    // console.log("HELLO IM REDIS!!");
  }
}
