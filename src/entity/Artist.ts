import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn() // for the purposes of the postgres database
  @Field()
  name: string;

  @Field()
  @Column()
  popularity: number;

  @Field()
  @Column()
  type: string;
}
