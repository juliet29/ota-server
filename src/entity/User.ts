import { TopFive } from "../modules/user/UserTopFive";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { AlbumPost, ArtistPost, TrackPost } from "./ContentPosts";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column("text", { nullable: true })
  profilePicture: string;

  @Field(() => String)
  @Column("text", { unique: true, nullable: true })
  email: string | null;

  @Column("text", { nullable: true })
  password: string;

  @Field(() => String)
  @Column("text", { nullable: true })
  facebookId: string | null;

  @Field(() => String)
  @Column("text", { nullable: true })
  googleId: string | null;

  // TODO: reset default to be false after implement confirm user functionality
  @Column("bool", { default: true })
  confirmed: boolean;

  @Field(() => Number)
  @Column("simple-array", { nullable: true })
  followers: number[];

  // ---- TOP FIVE

  @Field(() => [TopFive])
  @Column("jsonb", { nullable: true })
  topArtists: TopFive[];

  @Field(() => [TopFive])
  @Column("jsonb", { nullable: true })
  topAlbums: TopFive[];

  @Field(() => [TopFive])
  @Column("jsonb", { nullable: true })
  topTracks: TopFive[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  // ---- POSTS BY THE USER
  @OneToMany(() => TrackPost, (trackPost) => trackPost.user)
  trackPost: TrackPost[];

  @OneToMany(() => ArtistPost, (artistPost) => artistPost.user)
  artistPost: ArtistPost[];

  @OneToMany(() => AlbumPost, (albumPost) => albumPost.user)
  albumPost: AlbumPost[];
}
