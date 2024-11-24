import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Provide role name', example: 'Patient' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Provide clear description about the role',
    example: 'This role is assigned to a patient',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
