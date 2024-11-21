import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { UserService } from 'src/user/user.service';
import ExtendedRequest from 'src/common/interfaces/ExtendedRequest';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: ExtendedRequest, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const isLoggedOut = await this.userService.findToken(token);
    if (isLoggedOut) {
      throw new UnauthorizedException(
        'Unauthorized, Please login to continue!',
      );
    }

    req.token = token;

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
