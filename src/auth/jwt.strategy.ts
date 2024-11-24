import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import ExtendedRequest from 'src/common/interfaces/ExtendedRequest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: ExtendedRequest, payload: any) {
    const user = await this.userService.findOne(payload.sub);

    if (!user)
      throw new UnauthorizedException(
        'Unauthorized, Please login to continue!',
      );

    delete user.password;
    delete user.confirmPassword;
    delete user.registration_key;

    return user;
  }
}
