import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Track } from "../modules/spotify/search/SearchTypes";
import { Comment } from "./Comment";
import { User } from "./User";

@ObjectType()
@InputType("TrackInput")
export class PlaylistTrack extends Track {
  @Field()
  trackImageUrl: string;
}

@ObjectType()
@Entity()
export class Playlist extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @Field()
  @Column("text", { nullable: true })
  playlistPicture: string;

  @Field(() => [PlaylistTrack])
  @Column("jsonb", { nullable: true })
  tracks: PlaylistTrack[];

  @Field()
  @CreateDateColumn()
  timeSubmitted: Date;

  @OneToMany(() => Comment, (comment) => comment.poll)
  comment: Comment[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  likes?: number;

  @ManyToOne(() => User, (user) => user.playlist)
  @Field(() => User)
  user: User;
}
