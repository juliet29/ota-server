import { InputType, Field } from "type-graphql";
import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class ChangePassowrdInput extends PasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}
