import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Provide menu label', example: 'Roles' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Provide menu icon',
    example: 'eos-icons:role-binding',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    description: 'Provide menu description',
    example: 'Menu for all viewing all roles',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Provide menu ordering', example: 1 })
  @IsInt()
  @IsNotEmpty()
  ordering: number;

  @ApiProperty({
    description: 'Provide securable to this role',
    example: '-------------------',
  })
  @IsUUID()
  securable_id: string;
}
