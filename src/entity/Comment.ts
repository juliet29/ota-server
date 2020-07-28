import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AlbumPost, ArtistPost, TrackPost } from "./ContentPosts";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
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
  likes?: number;

  @ManyToOne(() => User, (user) => user.artistPost)
  @Field(() => User)
  user: User;

  @ManyToOne(() => TrackPost, (trackPost) => trackPost.comment)
  @Field(() => TrackPost)
  trackPost: TrackPost;

  @ManyToOne(() => ArtistPost, (artistPost) => artistPost.comment)
  @Field(() => ArtistPost)
  artistPost: ArtistPost;

  @ManyToOne(() => AlbumPost, (albumPost) => albumPost.comment)
  @Field(() => AlbumPost)
  albumPost: AlbumPost;
}
