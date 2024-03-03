import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config, serverConfig } from '../../interfaces';

@Injectable()
export class ConfigService implements Config {
  constructor(private readonly configService: NestConfigService) {}

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get SERVER(): serverConfig {
    return {
      HOST: this.configService.get<string>('HOST'),
      PORT: this.configService.get<number>('PORT'),
    };
  }

  get DATABASE_URL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get ALLOWED_ORIGINS(): string[] {
    return this.configService.get<string[]>('ALLOWED_ORIGINS');
  }

  get JWT_ACCESS_TOKEN_EXPIRATION(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');
  }

  get JWT_REFRESH_TOKEN_EXPIRATION(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');
  }

  get JWT_REFRESH_TOKEN_COOKIE_EXPIRATION(): number {
    return this.configService.get<number>(
      'JWT_REFRESH_TOKEN_COOKIE_EXPIRATION',
    );
  }

  get SMTP_SERVICE(): string {
    return this.configService.get<string>('SMTP_SERVICE');
  }

  get SMTP_SERVICE_EMAIL(): string {
    return this.configService.get<string>('SMTP_SERVICE_EMAIL');
  }

  get SMTP_SERVICE_PASSWORD(): string {
    return this.configService.get<string>('SMTP_SERVICE_PASSWORD');
  }

  get GOOGLE_OAUTH_CLIENT_ID(): string {
    return this.configService.get<string>('GOOGLE_OAUTH_CLIENT_ID');
  }

  get GOOGLE_OAUTH_CLIENT_SECRET(): string {
    return this.configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET');
  }

  get GOOGLE_OAUTH_CLIENT_CALLBACK(): string {
    return this.configService.get<string>('GOOGLE_OAUTH_CLIENT_CALLBACK');
  }

  get EXPRESS_SESSION_SECRET(): string {
    return this.configService.get<string>('EXPRESS_SESSION_SECRET');
  }

  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  get isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  get isTest(): boolean {
    return this.NODE_ENV === 'test';
  }
}
