import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import LocalAuthGuard from 'src/auth/local-auth.guard';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import ExtendedRequest from 'src/common/interfaces/ExtendedRequest';
import APIResponse from 'src/utils/response';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'User can create new account' })
  @ApiResponseDecorator()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return new APIResponse(
      HttpStatus.CREATED,
      await this.userService.create(createUserDto),
    );
  }

  @ApiOperation({ summary: 'User can verify his/her email' })
  @ApiResponseDecorator()
  @Get(':registration_key/verify-email')
  async verifyEmail(@Param('registration_key') registration_key: string) {
    const result = await this.userService.verifyEmail(registration_key);
    return new APIResponse(HttpStatus.OK, result);
  }

  @ApiOperation({ summary: 'User can login to his/her account' })
  @ApiResponseDecorator()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = req.user as User;

    if (!user.isVerified) {
      throw new BadRequestException(
        'Your email is not verified. Please verify the OTP sent to your email.',
      );
    }

    const result = await this.authService.login(user);
    return new APIResponse(
      HttpStatus.OK,
      'Logged in to your account successfully.',
      {
        ...result,
        name: user.name,
        email: user.email,
      },
    );
  }

  @ApiOperation({
    summary: 'Each user has ability to logout in case he/she left the platform',
  })
  @ApiResponseDecorator()
  @Get('logout')
  @Auth('USER', 'ADMIN')
  async logout(@Req() req: ExtendedRequest) {
    await this.userService.logout(req.token);
    return new APIResponse(HttpStatus.OK, 'User logged out successfully.');
  }

  @ApiOperation({ summary: 'Admin can get all users.' })
  @ApiResponseDecorator()
  @Get()
  @Auth('ADMIN')
  async findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
  ) {
    const result = await this.userService.findAll(pageNumber, take);
    return new APIResponse(HttpStatus.OK, 'User fetched successfully.', result);
  }

  @ApiOperation({ summary: 'Admin can update his account information.' })
  @ApiResponseDecorator()
  @Patch()
  @Auth('ADMIN')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req['user'] as User;
    const updatedUser = await this.userService.update(id, updateUserDto);

    delete updatedUser.password;
    delete updatedUser.confirmPassword;
    delete updatedUser.registration_key;

    return new APIResponse(
      HttpStatus.OK,
      'email' in updateUserDto
        ? 'User updated successfully, Please verify your email to continue.'
        : 'User updated successfully.',
      updatedUser,
    );
  }

  @ApiOperation({ summary: 'Verify OTP after registration' })
  @Post('verify-registration-otp')
  async verifyRegistrationOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;

    // Delegate OTP verification and user status update to UserService
    const result = await this.userService.verifyOtp(email, otp);

    return new APIResponse(HttpStatus.OK, result);
  }

  @ApiOperation({ summary: 'Admin can remove any user in the system.' })
  @ApiResponseDecorator()
  @Delete(':id')
  @Auth('ADMIN')
  async remove(@Param('id', ValidUUID) id: string) {
    const deletedUser = await this.userService.remove(id);

    delete deletedUser.password;
    delete deletedUser.confirmPassword;
    delete deletedUser.registration_key;

    return new APIResponse(
      HttpStatus.OK,
      `User (${deletedUser.email}) deleted successfully.`,
      deletedUser,
    );
  }
}
