import { AuthenticationError } from "apollo-server-express";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Playlist } from "../../entity/Playlist";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
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
export class PlaylistTrackInput {
  @Field()
  trackImageUrl?: string;
  @Field()
  name?: string;
  @Field()
  id?: string;
  @Field(() => [String])
  artists?: string[];
  @Field()
  externalUrl?: string;
}

@InputType()
export class PlaylistInput {
  @Field(() => [PlaylistTrackInput])
  tracks: PlaylistTrackInput[];
}

@Resolver()
export class CreatePlaylistResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Playlist)
  async createPlaylist(
    @Arg("data")
    { tracks }: PlaylistInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    // set the first tracks image to be this playlists picture
    const playlistPicture = tracks.map((track) => track.trackImageUrl)[0];

    let newPlaylist: Playlist;
    const likes = 0;
    try {
      newPlaylist = await Playlist.create({
        tracks,
        playlistPicture,
        likes,
        user,
      }).save();
    } catch (err) {
      throw new Error(err);
    }

    return newPlaylist;
  }
}
