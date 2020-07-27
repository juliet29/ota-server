// all the posts with actual content, for now:
// artists, albums, tracks
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BasePost } from "./BasePost";
import { User } from "./User";
import { Comment } from "./Comment";

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

  @Field()
  @Column()
  artistName: string;

  @ManyToOne(() => User, (user) => user.artistPost)
  @Field(() => User)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.artistPost)
  comment: Comment[];
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

  @Field()
  @Column()
  albumName: string;

  @ManyToOne(() => User, (user) => user.albumPost)
  @Field(() => User)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.albumPost)
  comment: Comment[];
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

  @Field()
  @Column()
  trackName: string;

  @ManyToOne(() => User, (user) => user.trackPost)
  @Field(() => User)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.trackPost)
  comment: Comment[];
}
