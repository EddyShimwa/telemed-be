import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import SendEmailCommand from 'src/email/commands/implementation/send-email.command';
import { RoleService } from 'src/role/role.service';
import { Permission } from 'src/role/entities/permission.entity';
import { generateOtp } from 'src/utils/otp';
import PaginatorHelper from 'src/utils/paginator-helper';
import Password from 'src/utils/password-hash';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
    private readonly paginateHelper: PaginatorHelper,
    private readonly roleService: RoleService,
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

    // OTP is valid; mark user as verified
    user.otp = null;
    user.otpExpiresAt = null;
    user.isVerified = true; // Update verified status
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
    const validRoles = ['Admin', 'Provider', 'Patient', 'Developer'];
    if (!roleName || !validRoles.includes(roleName)) {
      throw new BadRequestException(
        `Invalid role. Allowed roles are: ${validRoles.join(', ')}`,
      );
    }

    const role = await this.roleService.findOneBy('name', roleName);

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found.`);
    }

    // Create the user
    const user = this.userRepository.create(createUserDto);

    user.registration_key = Math.random().toString(36).substring(2, 15);

    await this.userRepository.save(user);

    await this.assignRole(user.id, role.id);

    // Send verification email
    await this.generateAndSendOtp(email);

    return 'Account created successfully. Kindly verify your OTP to complete registration.';
  }

  async assignRole(user_id: string, role_id: string) {
    const role = await this.roleService.findOne(role_id);
    const user = await this.findOne(user_id);
    const permission = this.permissionRepository.create({ role, user });
    return this.permissionRepository.save(permission);
  }

  async removeRole(user_id: string, role_id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { role: { id: role_id }, user: { id: user_id } },
    });

    if (!permission) {
      throw new BadRequestException('Permission does not exist');
    }

    return this.permissionRepository.remove(permission);
  }

  async findAll(pageNumber: number, take?: number) {
    return PaginatorHelper.paginate<User>(
      this.userRepository,
      'users',
      pageNumber,
      take,
      ['id', 'name', 'email', 'isVerified', 'createdAt', 'roles'], // fields
      ['roles'], // relations
    );
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    console.log(user);
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('User not found.');
    return user;
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
    return this.userRepository.remove(user);
  }
}
