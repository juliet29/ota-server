import { InputType, Field } from "type-graphql";

@InputType()
export class ChangePassowrdInput {
  @Field()
  token: string;

  @Field()
  password: string;
}
