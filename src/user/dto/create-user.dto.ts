import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import MatchValue from './password-request-checks';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    example: '@StrongPassword123',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    },
  )
  password: string;

  @ApiProperty({
    description: "User's confirm password",
    example: '@StrongPassword123',
  })
  @IsString()
  @MatchValue('password')
  confirmPassword: string;

  @ApiProperty({
    description: 'Role of the user (Admin, Provider, Patient)',
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(Admin|Provider|Patient)$/i, {
    message: 'Role must be one of the following: Admin, Provider, Patient',
  })
  roleName: string;
}
