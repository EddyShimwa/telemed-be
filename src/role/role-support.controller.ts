import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import APIResponse from 'src/utils/response';
import Role from './entities/role.entity';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import { Authenticate } from 'src/common/decorators/auth.decorator';

@ApiTags('Role Support')
@Controller('role-support')
export class RoleSupportController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all-deleted')
  @ApiOperation({ summary: 'Admin can get all recently deleted roles' })
  @ApiResponseDecorator()
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
  })
  @ApiQuery({ name: 'take', required: false, description: 'Optional take' })
  @ApiQuery({ name: 'search', required: false, description: 'Optional search' })
  @Authenticate('/dashboard/settings/recent-deleted/roles')
  async findAllDeletedRoles(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    const result = await this.roleService.findAllDeleted(
      pageNumber,
      take,
      search,
    );
    return new APIResponse(
      HttpStatus.OK,
      'Deleted Roles fetched successfully',
      result,
    );
  }

  @Patch('recover/:id')
  @ApiOperation({ summary: 'Admin can recover deleted role by Id' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/recent-deleted/roles')
  async recoverRoleById(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Role>> {
    const result = await this.roleService.recoverRole(id);
    return new APIResponse<Role>(
      HttpStatus.OK,
      `Role ${result.name} recover successfully!`,
      result,
    );
  }
}
