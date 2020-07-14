import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class BasePost extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  timeSubmitted: Date;

  @Field()
  @Column()
  text: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  externalUrl: string;

  @ManyToOne(() => User, (user) => user.post)
  @Field(() => User)
  user: User;

  // link to song, artist, album are not mandatory, so field is nullable
  @Field({ nullable: true })
  @Column()
  imageUrl?: string;

  // @CreateDateColumn is a special column that is automatically set to the entity's insertion date. You don't need to set this column - it will be automatically set.
}
