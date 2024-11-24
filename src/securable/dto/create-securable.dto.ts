import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSecurableDto {
  @ApiProperty({
    description: 'Provide securable name',
    example: 'Roles securable',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Provide securable route',
    example: '/dashboard/roles',
  })
  @IsString()
  @IsNotEmpty()
  route: string;

  @ApiProperty({
    description: 'Provide securable description',
    example: 'This securable give only the administractor to access roles',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
