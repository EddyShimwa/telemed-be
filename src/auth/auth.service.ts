import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import Password from 'src/utils/password-hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const isPassword = await Password.compare(password, user.password);
      if (isPassword) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, confirmPassword, registration_key, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: Pick<User, 'id'>) {
    const payload = {
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
