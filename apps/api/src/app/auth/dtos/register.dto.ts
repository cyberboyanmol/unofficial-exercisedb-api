import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserRegistrationDto {
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  readonly lastName?: string;
}
