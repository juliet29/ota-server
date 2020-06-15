// for validation, making sure all the field inputs  are meaningful
// BEFORE they enter the database!

import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsEmailAlreadyInUse } from "./isEmailAlreadyInUse";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyInUse({ message: "Email is already in use" })
  email: string;

  @Field()
  password: string;
}
