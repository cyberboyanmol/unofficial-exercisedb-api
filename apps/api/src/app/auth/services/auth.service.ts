import { ConfigService } from '@/libs/config/config.service';
import { UserRepository } from '@/libs/dal';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
interface Payload {
  email: string;
  id: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly useRepository: UserRepository,
  ) {}
  public async authenticate() {
    return 'user';
  }

  public async generateAccessToken(payload: Payload) {
    const privateAccessKeyPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'keys',
      'accessToken',
      'private.pem',
    );

    try {
      const privateKey = await readFile(privateAccessKeyPath, 'utf-8');
      const options: jwt.SignOptions = {
        algorithm: 'RS256',
        expiresIn: this.configService.JWT_ACCESS_TOKEN_EXPIRATION,
        issuer: 'ExerciseDB',
        audience: `user_id-${payload.id}`,
        subject: 'accessToken',
      };

      const accessToken = jwt.sign(payload, privateKey, options);
      return accessToken;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public async verifyAccessToken(token: string) {
    const publicAccessKeyPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'keys',
      'accessToken',
      'public.pem',
    );

    try {
      const publickey = await readFile(publicAccessKeyPath, 'utf8');

      const options: jwt.SignOptions = {
        algorithm: 'RS256',
        issuer: 'ExerciseDB',
      };

      const decoded = jwt.verify(token, publickey, options);
      return decoded;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  public async generateRefreshToken(payload: Payload) {
    const privateAccessKeyPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'keys',
      'refreshToken',
      'private.pem',
    );

    try {
      const privateKey = await readFile(privateAccessKeyPath, 'utf-8');
      const options: jwt.SignOptions = {
        algorithm: 'RS256',
        expiresIn: this.configService.JWT_REFRESH_TOKEN_EXPIRATION,
        issuer: 'ExerciseDB',
        audience: `user_id-${payload.id}`,
        subject: 'refreshToken',
      };

      const refreshToken = jwt.sign(payload, privateKey, options);
      return refreshToken;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  public async verifyRefreshToken(token: string) {
    const publicAccessKeyPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'keys',
      'refreshToken',
      'public.pem',
    );

    try {
      const publickey = await readFile(publicAccessKeyPath, 'utf8');

      const options: jwt.SignOptions = {
        algorithm: 'RS256',
        issuer: 'ExerciseDB',
      };

      const decoded = jwt.verify(token, publickey, options);
      return decoded;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async getUser(id: string) {
    return this.useRepository.findById(id);
  }
}
