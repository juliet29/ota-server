import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

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

  @Field()
  name: string;

  @Column()
  password: string;
}
