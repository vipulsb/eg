import { IsEmail, IsString, ValidateIf } from "class-validator";

export class UserSignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @ValidateIf((o) => o.name)
  name: string;

  @IsString()
  password: string;
}

export class UserLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
