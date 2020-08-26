import { getConnectionOptions, createConnection } from "typeorm";
import { User } from "../entity/User";
import { BasePost } from "../entity/BasePost";
import { ArtistPost, AlbumPost, TrackPost } from "../entity/ContentPosts";
import { Comment } from "../entity/Comment";
import { Poll } from "../entity/Poll";
import { Playlist } from "../entity/Playlist";
import { DirectMessage } from "../entity/DirectMessage";

export const createTypeormConnection = async () => {
  console.log(`typeorm knows our env is ${process.env.NODE_ENV}`);
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    const productionConn = {
      ...connectionOptions,
      url: process.env.DATABASE_URL,
      entities: [
        User,
        BasePost,
        ArtistPost,
        AlbumPost,
        TrackPost,
        Comment,
        Poll,
        Playlist,
        DirectMessage,
      ],
      name: "default",
    } as any;
    // url will only be defined when actually in production
    console.log(productionConn);

    return createConnection(productionConn);
  } else {
    console.log(connectionOptions);
    return createConnection({ ...connectionOptions, name: "default" });
  }
};
