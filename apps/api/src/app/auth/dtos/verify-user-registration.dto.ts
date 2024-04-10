import { IsDefined, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyUserRegistrationDto {
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsNumber()
  readonly otp: number;
}
