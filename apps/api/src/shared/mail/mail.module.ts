import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'amazingfacts7455@gmail.com',
          pass: 'qrvbuoimflrqlxnt',
        },
      },
      defaults: {
        from: `'ExerciseDB' <no-reply@gmail.com>`,
      },
      template: {
        dir: `${process.cwd()}/templates/`,
        adapter: new EjsAdapter(),
      },
    }),
  ],
})
export class MailModule {}
