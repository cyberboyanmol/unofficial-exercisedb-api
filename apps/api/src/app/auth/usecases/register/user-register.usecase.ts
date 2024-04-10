import { UserRepository } from '@/libs/dal';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegisterCommand } from './user-register.command';
import { normalizeEmail } from '@/shared/helpers/email-normalization.service';
import { RedisRepository } from '@/libs/redis/redis.repository';
import { RedisExpiration, RedisPrefixEnum } from '@/utils/constants';
import { generateOtp, generateOtpHash } from '@/shared/helpers/otp.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AuthService } from '../../services/auth.service';
@Injectable()
export class UserRegister {
  constructor(
    private readonly useRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly redisRespository: RedisRepository,
    @InjectQueue('email:notification') private emailQueue: Queue,
  ) {}

  async execute(command: UserRegisterCommand) {
    const email = normalizeEmail(command.email);
    /**
     *
     *  TODO: ADD A RATELIMITER OR THROTTLE FOR SIGNUP REQUEST FROM SAME MAIL
     */

    const existingUser = await this.useRepository.findByEmail(email);

    if (existingUser) throw new BadRequestException('User already exists');

    const otp = await generateOtp();
    const hashData = `${email}${otp}`;

    const hash = await generateOtpHash(hashData);

    await this.redisRespository.setWithExpiry(
      RedisPrefixEnum.USER_REGISTER,
      `${email}:${hash}`,
      JSON.stringify({
        email,
        firstName: command.firstName,
        lastName: command.lastName,
      }),
      RedisExpiration.FIVE_MINUTES,
    );

    await this.emailQueue.add(
      'register:otp',
      {
        recipientEmail: email,
        otp,
        name: command.firstName,
      },
      { attempts: 3, removeOnComplete: true, removeOnFail: true },
    );

    return `Otp sent successfully to your email ${command.email}`;
  }
}
