import { MailerService } from '@nestjs-modules/mailer';
import {
  OnGlobalQueueFailed,
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { RegisterOtp } from './interfaces/job.interface';
import { Logger } from '@nestjs/common';

@Processor('email:notification')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}
  @Process('register:otp')
  async sendRegistrationOtp(job: Job<RegisterOtp>) {
    const { recipientEmail, otp } = job.data;

    const emailData = {
      to: recipientEmail,
      template: 'otpverify',
      context: {
        otp: otp,
      },
      subject: 'OTP to complete the sign-up for your new ExerciseDB account!',
    };

    await this.mailService.sendMail(emailData);
  }

  @OnQueueActive()
  onActive(job: Job<RegisterOtp>) {
    Logger.log(`Starting job ${job.id} ${job.data.recipientEmail} `);
  }
  @OnGlobalQueueFailed()
  onFailed(job: Job<RegisterOtp>) {
    if (job.isFailed) {
      job.remove();
    }
    Logger.log(`job failed ${job.id} ${job.data.recipientEmail} `);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<RegisterOtp>) {
    job.remove();
    Logger.log(`Job ${job.id} has been finished  ${job.data.recipientEmail}`);
  }
}
