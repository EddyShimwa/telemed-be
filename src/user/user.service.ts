import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import SendEmailCommand from 'src/email/commands/implementation/send-email.command';
import Role from 'src/role/entities/role.entity';
import PaginatorHelper from 'src/utils/paginator-helper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Logout from './entities/logout.entity';
import { User } from './entities/user.entity';
import Password from 'src/utils/password-hash';
import { generateOtp } from 'src/utils/otp';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Logout)
    private readonly logoutRepository: Repository<Logout>,
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
    private readonly paginateHelper: PaginatorHelper,
  ) {}

  async generateAndSendOtp(email: string): Promise<string> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const otp = generateOtp(6); // Generate a 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set expiration to 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await this.userRepository.save(user);

    // Send OTP via email
    try {
      await this.commandBus.execute(
        new SendEmailCommand(
          user.email,
          'Your OTP Code',
          user.name,
          `<p>Your OTP code is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
          'Verify OTP',
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to send OTP email: ${error.message}`,
      );
    }

    return 'OTP sent successfully.';
  }

  // otp verification
  async verifyOtp(email: string, otp: string): Promise<string> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      throw new BadRequestException('OTP is invalid or has expired.');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    // OTP is valid; clear it from the database
    user.otp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    return 'OTP verified successfully.';
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const { email, roleName } = createUserDto;

    // when the email already exists
    const userByEmail = await this.findOneByEmail(email);
    if (userByEmail) {
      throw new BadRequestException(`User with email ${email} already exists!`);
    }

    // Validate and assign role
    const validRoles = ['Admin', 'Provider', 'Patient'];
    if (!roleName || !validRoles.includes(roleName)) {
      throw new BadRequestException(
        `Invalid role. Allowed roles are: ${validRoles.join(', ')}`,
      );
    }

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found.`);
    }

    // Create the user
    const user = this.userRepository.create(createUserDto);
    user.role = role;
    user.registration_key = Math.random().toString(36).substring(2, 15);

    await this.userRepository.save(user);

    // Send verification email
    try {
      await this.commandBus.execute(
        new SendEmailCommand(
          user.email,
          'Verify Your Email',
          user.name,
          `<p>You have been registered on our platform. To complete your registration, please verify your email.</p>`,
          'Verify Email',
          `${this.configService.get<string>('BACKEND_URL')}/api/users/${user.registration_key}/verify-email`,
        ),
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to send verification email: ${error.message}`,
      );
    }

    return 'Account created successfully. Kindly verify your email.';
  }

  async findAll(pageNumber: number, take?: number) {
    return PaginatorHelper.paginate<User>(
      this.userRepository,
      'users',
      pageNumber,
      take,
      ['id', 'name', 'email', 'isVerified', 'createdAt', 'role'], // fields
      ['role'], // relations
    );
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async verifyEmail(registration_key: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ registration_key });
    if (!user)
      throw new NotFoundException(
        'User with given registration_key is not found.',
      );

    if (user.isVerified)
      throw new BadRequestException('Sorry, This email is already verified.');

    user.isVerified = true;
    await this.userRepository.save(user);
    return 'Email verified successfully.';
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found.');

    if ('password' in updateUserDto) {
      const password = Password.hash(updateUserDto.password);
      Object.assign(user, {
        ...updateUserDto,
        password,
        confirmPassword: password,
      });
    } else {
      Object.assign(user, updateUserDto);
    }

    if ('email' in updateUserDto) {
      user.isVerified = false;
      await this.commandBus.execute(
        new SendEmailCommand(
          updateUserDto.email,
          'Email changed, Verify your email',
          updateUserDto.name || user.name,
          `<p>You have changed your email, please verify your email by clicking the button below.</p>`,
          'Verify email',
          `${this.configService.get<string>('BACKEND_URL')}/api/users/${user.registration_key}/verify-email`,
        ),
      );
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found.');

    return this.userRepository.remove(user);
  }

  async logout(token: string): Promise<Logout> {
    const logoutToken = this.logoutRepository.create({ token });
    return this.logoutRepository.save(logoutToken);
  }

  async findToken(token: string): Promise<Logout> {
    return await this.logoutRepository.findOne({ where: { token } });
  }
}
