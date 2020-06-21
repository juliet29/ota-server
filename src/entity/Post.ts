import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  // link to song, artist, album are not mandatory, so field is nullable
  @Field({ nullable: true })
  @Column()
  link?: string;

  @Field()
  @Column()
  timeSubmitted: Date;

  @ManyToOne(() => User, (user) => user.post)
  @Field(() => User)
  user: User;
}
