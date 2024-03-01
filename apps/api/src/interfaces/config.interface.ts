export interface Config {
  NODE_ENV: string;
  SERVER: serverConfig;
  DATABASE_URL: string;
  ALLOWED_ORIGINS: Array<string>;
  JWT_ACCESS_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: number;
  SMTP_SERVICE: string;
  SMTP_SERVICE_EMAIL: string;
  SMTP_SERVICE_PASSWORD: string;
  OAUTH_GOOGLE_CLIENT_ID: string;
  OAUTH_GOOGLE_CLIENT_SECRET: string;
  OAUTH_GOOGLE_CLIENT_CALLBACK: string;
  EXPRESS_SESSION_SECRET: string;
}

export interface serverConfig {
  HOST: string;
  PORT: number;
}
