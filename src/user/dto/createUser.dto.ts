import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsStrongPassword()
  @Length(6)
  password: string;
}
