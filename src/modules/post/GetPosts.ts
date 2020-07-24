import { Arg, createUnionType, Query, Resolver } from "type-graphql";
// import { isAuth } from "../middleware/isAuth";
import { AlbumPost, ArtistPost, TrackPost } from "../../entity/ContentPosts";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/User";

const GetPostsResultUnion = createUnionType({
  name: "GetPostsResult",
  types: () => [AlbumPost, ArtistPost, TrackPost] as const,
  resolveType: (value) => {
    if ("albumId" in value) {
      return AlbumPost;
    }
    if ("trackId" in value) {
      return TrackPost;
    }

    return ArtistPost;
  },
});

@Resolver()
export class GetPostsResolver {
  // return all the Posts in the db
  // @UseMiddleware(isAuth)
  @Query(() => [GetPostsResultUnion])
  async getPosts() {
    const artists = await ArtistPost.find({ relations: ["user"] });
    const albums = await AlbumPost.find({ relations: ["user"] });
    const tracks = await TrackPost.find({ relations: ["user"] });

    return [...artists, ...albums, ...tracks];
  }

  // @UseMiddleware(isAuth)
  @Query(() => [TrackPost])
  async getUserPosts(@Arg("id") id: number) {
    // const userPosts = await TrackPost.find({ where: [{ user : id }] });
    console.log(id);

    // const userPosts = await createQueryBuilder()
    //   .relation(TrackPost, "user")
    //   .of(1) // you can use just post id as well
    //   .loadMany();

    const userPosts = await createQueryBuilder()
      .relation(User, "post")
      .of(id) // you can use just post id as well
      .loadMany();

    // const userPosts = await createQueryBuilder("track_post")
    //   .leftJoinAndSelect("track_post.user", "user")
    //   .where("user.id = :userId", { userId: id })
    //   .getOne();

    console.log(userPosts);

    // const userPosts2 = await createQueryBuilder("user")
    // .leftJoinAndSelect("user.photos", "photo")
    // .where("user.name = :name", { name: "Timber" })
    // .getOne();

    return userPosts;
  }

  @Query(() => [ArtistPost])
  async getArtistPosts(@Arg("id") id: string) {
    const artists = await ArtistPost.find({
      relations: ["user"],
      where: { artistId: id },
    });

    return [...artists];
  }

  @Query(() => [AlbumPost])
  async getAlbumPosts(@Arg("id") id: string) {
    const albums = await AlbumPost.find({
      relations: ["user"],
      where: { albumId: id },
    });
    return [...albums];
  }

  @Query(() => [TrackPost])
  async getTrackPosts(@Arg("id") id: string) {
    const tracks = await TrackPost.find({
      relations: ["user"],
      where: { trackId: id },
    });

    return [...tracks];
  }
}
