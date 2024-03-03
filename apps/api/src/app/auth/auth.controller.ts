// import { ROUTES } from '@/utils/constants';
import { ConfigService } from '@/libs/config/config.service';
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
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
    // console.log(request);
    return response.redirect('http://localhost:3000');
  }
}
