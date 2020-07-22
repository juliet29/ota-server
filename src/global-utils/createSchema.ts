import { buildSchema } from "type-graphql";
import { CreateAlbumPostResolver } from "../modules/post/content-posts/CreateAlbumPost";
import { CreateArtistPostResolver } from "../modules/post/content-posts/CreateArtistPost";
import { CreateTrackPostResolver } from "../modules/post/content-posts/CreateTrackPost";
import { CreatePostResolver } from "../modules/post/CreatePost";
import { GetPostsResolver } from "../modules/post/GetPosts";
import { GetAlbumTracksResolver } from "../modules/spotify/info/GetAlbumTracks";
import { GetArtistAlbumsResolver } from "../modules/spotify/info/GetArtistInfo";
import { SearchResolver } from "../modules/spotify/search/Search";
import { GetCurrentUserResolver } from "../modules/user/current-user/GetCurrentUser";
// import { ChangePasswordResolver } from "../modules/user/ChangePassword";
// import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
// import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/current-user/Login";
import { LogoutResolver } from "../modules/user/current-user/Logout";
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
      SearchResolver,
      CreateArtistPostResolver,
      CreateAlbumPostResolver,
      CreateTrackPostResolver,
      GetArtistAlbumsResolver,
      GetAlbumTracksResolver,
    ],
    nullableByDefault: true,
    //TODO remove this
    // userId cookie must be available on session to access authorized resolvers
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
