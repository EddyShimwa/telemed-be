import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Generate and send OTP to user email' })
  @Post('send')
  async sendOtp(@Body('email') email: string): Promise<string> {
    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    return this.userService.generateAndSendOtp(email);
  }

  @ApiOperation({ summary: 'Verify OTP for a user' })
  @Post('verify')
  async verifyOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<string> {
    const { email, otp } = body;
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required.');
    }

    return this.userService.verifyOtp(email, otp);
  }
}
