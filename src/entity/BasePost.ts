import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

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

  // link to song, artist, album are not mandatory, so field is nullable
  @Field({ nullable: true })
  @Column()
  imageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  likes?: number;
}
