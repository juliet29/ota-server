import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Field()
  @Column()
  conversationID: string;

  // @Field(() => (AlbumPost | ArtistPost | TrackPost | Poll | Playlist))
  // @Column("jsonb", { nullable: true })
  // content: AlbumPost | ArtistPost | TrackPost | Poll | Playlist
}
