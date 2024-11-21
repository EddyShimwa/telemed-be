import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export default class LocalLoginStrategy extends PassportStrategy(
  Strategy,
  'login',
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Wrong credentials.');

    if (!user.isVerified)
      throw new UnauthorizedException('Please verify your email to continue.');

    return user;
  }
}
