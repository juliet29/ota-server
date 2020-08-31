import { Field, ID, ObjectType, InputType } from "type-graphql";
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

@ObjectType()
@InputType("PollOptionInput")
export class PollOption extends BaseEntity {
  @Field()
  option: string;

  @Field()
  votes: number;
}

@ObjectType()
@Entity()
export class Poll extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @Field()
  @Column("text")
  question: string;

  @Field()
  @Column()
  length: number;

  @Field(() => [PollOption])
  @Column("jsonb", { nullable: true })
  options: PollOption[];

  @Field()
  @CreateDateColumn()
  timeSubmitted: Date;

  @OneToMany(() => Comment, (comment) => comment.poll)
  comment: Comment[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  likes?: number;

  @ManyToOne(() => User, (user) => user.poll)
  @Field(() => User)
  user: User;
}
