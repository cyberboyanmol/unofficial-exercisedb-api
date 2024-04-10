// import { ROUTES } from '@/utils/constants';
import { ConfigService } from '@/libs/config/config.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UserRegistrationDto } from './dtos/register.dto';

import { UserRegisterCommand } from './usecases/register/user-register.command';
import { UserRegister } from './usecases/register/user-register.usecase';
import { VerifyUserRegistration } from './usecases/verify-user-registration/verify-user-registration.usecase';
import { VerifyUserRegistrationCommand } from './usecases/verify-user-registration/verify-user-registration.command';
import { VerifyUserRegistrationDto } from './dtos/verify-user-registration.dto';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userRegisterUsecase: UserRegister,
    private VerifyUserRegistrationUsecase: VerifyUserRegistration,
  ) {}

  @Get('/google')
  googleAuth() {
    Logger.verbose(`Checking Github Auth`);
    if (
      !this.configService.GOOGLE_OAUTH_CLIENT_ID ||
      !this.configService.GOOGLE_OAUTH_CLIENT_SECRET
    ) {
      throw new BadRequestException(
        'Google auth is not configured, please provide GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET as env variables',
      );
    }
    Logger.verbose('Google Auth has all variables.');
    return { status: 'success', message: 'Google Authentication' };
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() request, @Res() response) {
    return response.redirect('http://localhost:3000');
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  async userRegistration(@Body() body: UserRegistrationDto) {
    return await this.userRegisterUsecase.execute(
      UserRegisterCommand.create({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
      }),
    );
  }

  @Post('/register/verify')
  @Header('Cache-Control', 'no-store')
  async verifyUserRegistration(
    @Body() body: VerifyUserRegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // otp verification and user creation
    // generate a access token and refresh token and send back to user add the refresh token to _refresh_jwt cookie
    const user = await this.VerifyUserRegistrationUsecase.execute(
      VerifyUserRegistrationCommand.create({
        email: body.email,
        otp: body.otp,
      }),
    );
    const accessToken = await this.authService.generateAccessToken({
      email: user.email,
      id: user.id,
    });

    const refreshToken = await this.authService.generateRefreshToken({
      email: user.email,
      id: user.id,
    });
    /**
     *  GENERATE A REFRESH TOKEN AND ADD TO COOKIE
     *  AND ADD REFRESH TOKEN IN THE DATABASE
     */
    res.cookie('_jwt_refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: this.configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
    });
    return {
      user,
      accessToken,
    };
  }
  // for user login
  @Post('/login')
  @Header('Cache-Control', 'no-store')
  async userLogin(@Body() body: any) {}

  @Post('/login/verify')
  async verifyUserLogin() {}

  @Get('/me')
  async getUser() {
    return await this.authService.getUser('65f84ecc55a24ffe156b8b8b');
  }
}

// TODO
// setup a bullmq queue service with redis and redis for cache
