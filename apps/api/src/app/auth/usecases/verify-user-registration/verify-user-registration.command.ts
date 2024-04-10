import { BaseCommand } from '@/shared/commands/base.command';
import { IsDefined, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyUserRegistrationCommand extends BaseCommand {
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsNumber()
  readonly otp: number;
}
