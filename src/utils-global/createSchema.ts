import { GetCurrentUserResolver } from "../modules/user/GetCurrentUser";
import { buildSchema } from "type-graphql";
import { ChangePasswordResolver } from "../modules/user/ChangePassword";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { RegisterResolver } from "../modules/user/Register";
import { CreatePostResolver } from "../modules/post/CreatePost";
import { GetPostsResolver } from "../modules/post/GetPosts";

export const CreateSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      GetCurrentUserResolver,
      RegisterResolver,
      CreatePostResolver,
      GetPostsResolver,
    ],
    // userId cookie must be available on session to access authorized resolvers
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
