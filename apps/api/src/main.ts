import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { ConfigService } from './libs/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: configService.ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  // app.set('trust proxy', 'loopback');
  app.use(passport.initialize());
  console.log(configService.ALLOWED_ORIGINS);
  try {
    await app.listen(configService.SERVER.PORT, () => {
      console.log(`Running on Port ${configService.SERVER.PORT}`);
      console.log(
        `🚀 Server listening on http://${configService.SERVER.HOST}:${configService.SERVER.PORT}`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
