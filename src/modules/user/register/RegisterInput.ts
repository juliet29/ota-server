// for validation, making sure all the field inputs  are meaningful
// BEFORE they enter the database!

import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsEmailAlreadyInUse } from "./isEmailAlreadyInUse";
import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyInUse({ message: "Email is already in use" })
  email: string;

  @Field({ nullable: true })
  password: string;
}

@InputType()
export class FacebookRegisterInput {
  @Field()
  @Length(1, 255)
  id: string;

  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  email: string;
}
