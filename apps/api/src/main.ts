import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { ConfigService } from '@/libs/config/config.service';
import helmet from 'helmet';
import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: configService.ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        console.error(errors);
        const result = errors.map((error) => {
          // message: [...[Object.values(error.constraints)]],
          return {
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          };
        });
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.set('trust proxy', 'loopback');
  const server = app.getHttpServer();
  app.flushLogs();
  Logger.verbose(`Server timeout: ${server.timeout}`);
  server.keepAliveTimeout = 61 * 1000;
  Logger.verbose(
    `Server keepAliveTimeout: ${server.keepAliveTimeout / 1000}s `,
  );
  server.headersTimeout = 65 * 1000;
  Logger.verbose(`Server headersTimeout: ${server.headersTimeout / 1000}s `);
  app.use(passport.initialize());
  app.enableShutdownHooks();
  try {
    await app.listen(configService.SERVER.PORT, () => {
      Logger.log(
        `🚀 Server listening on http://${configService.SERVER.HOST}:${configService.SERVER.PORT}`,
      );
    });
  } catch (error) {
    Logger.log(error);
  }
}
bootstrap();
