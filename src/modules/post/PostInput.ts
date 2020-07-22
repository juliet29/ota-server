import { InputType, Field } from "type-graphql";

// TODO: put in sep file
@InputType()
export class PostInput {
  @Field()
  text: string;

  // TODO: validate url w IsUrl from "class-validators" --> see githun
  @Field()
  imageUrl: string;

  @Field()
  externalUrl: string;
}
