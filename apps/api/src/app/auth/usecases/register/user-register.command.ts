import { BaseCommand } from '@/shared/commands/base.command';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterCommand extends BaseCommand {
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
