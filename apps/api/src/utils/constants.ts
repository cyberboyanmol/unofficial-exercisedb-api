export enum ROUTES {
  auth = 'auth',
}

export enum HttpStatusMessage {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PROGRESS = 'IN PROGRESS',
}

export enum RedisExpiration {
  /** Expires in 5 minutes (300 seconds) */
  FIVE_MINUTES = 300,

  /** Expires in 10 minutes (600 seconds) */
  TEN_MINUTES = 600,

  /** Expires in 1 hour (3600 seconds) */
  ONE_HOUR = 3600,

  /** Expires in 1 day (86400 seconds) */
  ONE_DAY = 86400,

  /** Expires in 7 days (604800 seconds) */
  ONE_WEEK = 604800,

  /** Expires in 1 month (assumed to be 30 days, 2592000 seconds) */
  ONE_MONTH = 2592000,
}

export enum RedisPrefixEnum {
  USER_REGISTER = 'register',
  USER_LOGIN = 'login',
}
