import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@ObjectType()
export class PlaylistTrack extends BaseEntity {
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
