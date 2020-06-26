import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Post } from "./Post";

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
  @Column("text", { unique: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;

  // @Column("text", { nullable: true })
  // spotifyId: string | null;

  // TODO: reset default to be false after implement confirm user functionality
  @Column("bool", { default: true })
  confirmed: boolean;

  // one user can have many post assigned to them
  @OneToMany(() => Post, (post) => post.user)
  post: Post[];
}
