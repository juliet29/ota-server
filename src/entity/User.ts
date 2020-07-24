import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TrackPost } from "./ContentPosts";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @Field()
  @Column()
  username: string;

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

  // one user can have many post assigned to them
  @OneToMany(() => TrackPost, (post) => post.user)
  post: TrackPost[];
}
