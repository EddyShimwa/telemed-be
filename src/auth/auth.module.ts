import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import LocalLoginStrategy from './local.strategy';
import JwtStrategy from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalLoginStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
