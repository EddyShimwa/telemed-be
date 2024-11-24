import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './createRoleDto.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
