import { UserRepository } from '@/libs/dal';
import { RedisRepository } from '@/libs/redis/redis.repository';
import { VerifyUserRegistrationCommand } from './verify-user-registration.command';
import { normalizeEmail } from '@/shared/helpers/email-normalization.service';
import { generateOtpHash } from '@/shared/helpers/otp.service';
import { RedisPrefixEnum } from '@/utils/constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegistrationDto as UserRegisterType } from '../../dtos/register.dto';
@Injectable()
export class VerifyUserRegistration {
  constructor(
    private useRepository: UserRepository,
    private redisRespository: RedisRepository,
  ) {}

  async execute(command: VerifyUserRegistrationCommand) {
    const email = normalizeEmail(command.email);

    const existingUser = await this.useRepository.findByEmail(email);

    if (existingUser) throw new BadRequestException('User already exists');

    const hashData = `${email}${command.otp}`;

    const hash = await generateOtpHash(hashData);

    //    check if the hashkey exists in redis
    const isValidUserRegistration = await this.redisRespository.get(
      RedisPrefixEnum.USER_REGISTER,
      `${email}:${hash}`,
    );

    if (!isValidUserRegistration) {
      throw new BadRequestException('Invalid OTP (One time password)');
    }

    const { firstName, lastName } = JSON.parse(
      isValidUserRegistration,
    ) as UserRegisterType;
    /**
     *  CREATE THE NEW USER
     */

    const user = await this.useRepository.create({
      email,
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
    });

    await this.redisRespository.delete(
      RedisPrefixEnum.USER_REGISTER,
      `${email}:${hash}`,
    );

    /**
     *  DELETE THE USER KEYS FROM REDIS
     */

    return await this.useRepository.findById(user.id);
  }
}
