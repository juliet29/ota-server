// import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import { User } from "../../entity/User";
// // import { redis } from "../../utils-global/redis";
// import { forgotPasswordPrefix } from "../constants/redisPrefixes";
// import bcrypt from "bcryptjs";
// import { ChangePassowrdInput } from "../user/changePassword/ChangePasswordInput";
// import { MyContext } from "../../types/MyContext";

// @Resolver()
// export class ChangePasswordResolver {
//   @Mutation(() => User, { nullable: true })
//   async changePassword(
//     @Arg("data") { token, password }: ChangePassowrdInput,
//     @Ctx() ctx: MyContext
//   ): Promise<User | null> {
//     const userId = await redis.get(forgotPasswordPrefix + token);
//     if (!userId) {
//       return null;
//     }

//     const user = await User.findOne(userId);

//     if (!user) {
//       return null;
//     }

//     await redis.del(forgotPasswordPrefix + token);

//     user.password = await bcrypt.hash(password, 12);

//     await user.save();

//     // automatically log the user in after their password has been changed
//     ctx.req.session!.userId = user.id;

//     return user;
//   }
// }
