import { buildSchema } from "type-graphql";
import { CreateAlbumPostResolver } from "../modules/post/content-posts/CreateAlbumPost";
import { CreateArtistPostResolver } from "../modules/post/content-posts/CreateArtistPost";
import { CreateTrackPostResolver } from "../modules/post/content-posts/CreateTrackPost";
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
import { GetCommentsResolver } from "../modules/comment/GetComment";
import { CreateCommentResolver } from "../modules/comment/CreateComment";
import { EditCommentResolver } from "../modules/comment/EditComment";
import { EditPostResolver } from "../modules/post/EditPost";
import { SearchPostResolver } from "../modules/post/SearchPosts";
import { OtherUserResolver } from "../modules/user/OtherUser";
import { UseTopFiveResolver } from "../modules/user/UserTopFive";
import { UploadImageResolver } from "../modules/user/UploadImage";
import { EditUserResolver } from "../modules/user/current-user/EditUser";

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
      GetPostsResolver,
      SearchResolver,
      CreateArtistPostResolver,
      CreateAlbumPostResolver,
      CreateTrackPostResolver,
      GetArtistAlbumsResolver,
      GetAlbumTracksResolver,
      GetCommentsResolver,
      CreateCommentResolver,
      EditCommentResolver,
      EditPostResolver,
      SearchPostResolver,
      OtherUserResolver,
      UseTopFiveResolver,
      UploadImageResolver,
      EditUserResolver,
    ],
    nullableByDefault: true,
    //TODO remove this
    // userId cookie must be available on session to access authorized resolvers
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
