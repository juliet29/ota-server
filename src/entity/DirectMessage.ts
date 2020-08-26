import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class DirectMessage extends BaseEntity {
  @Field(() => ID) // @Field() decorator is for the purposes of graphql
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  id: number;

  @ManyToOne(() => User, (user) => user.sentDM)
  @Field(() => User)
  sender: User;

  @ManyToOne(() => User, (user) => user.recievedDM)
  @Field(() => User)
  recipient: User;

  @Field()
  @CreateDateColumn()
  timeSubmitted: Date;

  @Field()
  @Column()
  text: string;
}
