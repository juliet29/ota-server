import { buildSchema } from "type-graphql";
// import { ChangePasswordResolver } from "../modules/user/ChangePassword";
// import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
// import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/current-user/Login";
import { LogoutResolver } from "../modules/user/current-user/Logout";

import { CreatePostResolver } from "../modules/post/CreatePost";
import { GetPostsResolver } from "../modules/post/GetPosts";
import { GetArtistResolver } from "../modules/spotify/GetArtist";
import { SearchResolver } from "../modules/spotify/Search";
import { CreateArtistPostResolver } from "../modules/post/content-posts/CreateArtistPost";
import { CreateAlbumPostResolver } from "../modules/post/content-posts/CreateAlbumPost";
import { CreateTrackPostResolver } from "../modules/post/content-posts/CreateTrackPost";
import { GetCurrentUserResolver } from "../modules/user/current-user/GetCurrentUser";
import { RegisterResolver } from "../modules/user/register/Register";

export const CreateSchema = () =>
  buildSchema({
    resolvers: [
      // ChangePasswordResolver,
      // ConfirmUserResolver,
      // ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      GetCurrentUserResolver,
      RegisterResolver,
      CreatePostResolver,
      GetPostsResolver,
      GetArtistResolver,
      SearchResolver,
      CreateArtistPostResolver,
      CreateAlbumPostResolver,
      CreateTrackPostResolver,
    ],
    nullableByDefault: true,
    //TODO remove this
    // userId cookie must be available on session to access authorized resolvers
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
