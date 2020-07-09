// all the posts with actual content, for now:
// artists, albums, tracks
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import { BasePost } from "./BasePost";

///TODO: abstract artist names
// @ObjectType()
// export class ArtistNames {
//   @Field(() => [String])
//   @Column("simple-array")
//   artistNames: string[];
// }

@ObjectType()
@Entity()
export class ArtistPost extends BasePost {
  @Field()
  @Column()
  artistId: string;
}

@ObjectType()
@Entity()
export class AlbumPost extends BasePost {
  @Field()
  @Column()
  albumId: string;

  @Field()
  @Column()
  rating: number;

  @Field(() => [String])
  @Column("simple-array")
  artistNames: string[];
}

@ObjectType()
@Entity()
export class TrackPost extends BasePost {
  @Field()
  @Column()
  trackId: string;

  @Field()
  @Column()
  vote: number; // make -1 or 1

  @Field(() => [String])
  @Column("simple-array")
  artistNames: string[];
}
