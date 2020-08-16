import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";
import { Track } from "../modules/spotify/search/SearchTypes";

@ObjectType()
@Entity()
export class Playlist extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @Field()
  @Column("text", { nullable: true })
  picture: string;

  @Field(() => [Track])
  @Column("jsonb", { nullable: true })
  tracks: Track[];

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
