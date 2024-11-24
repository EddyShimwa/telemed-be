import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import APIResponse from 'src/utils/response';
import { CreateRoleDto } from './dto/createRoleDto.dto';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import Role from './entities/role.entity';
import { RoleService } from './role.service';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import { Authenticate } from 'src/common/decorators/auth.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Admin can add new role' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/roles')
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<APIResponse<Role>> {
    const result = await this.roleService.create(createRoleDto);
    return new APIResponse<Role>(
      HttpStatus.CREATED,
      'Role added successfully!',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Admin can view all roles' })
  @ApiResponseDecorator()
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
  })
  @ApiQuery({ name: 'take', required: false, description: 'Optional take' })
  @ApiQuery({ name: 'search', required: false, description: 'Optional search' })
  @Authenticate('/dashboard/roles')
  async findAllRoles(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    const result = await this.roleService.findAll(pageNumber, take, search);
    return new APIResponse(HttpStatus.OK, 'Roles fetched successfully', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin can get role by Id' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/roles')
  async findRoleById(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Role>> {
    const result = await this.roleService.findOne(id);
    return new APIResponse<Role>(
      HttpStatus.OK,
      `Role ${result.name} fetched successfully`,
      result,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin can update any role by Id' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/roles')
  async updateRole(
    @Param('id', ValidUUID) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<APIResponse<Role>> {
    const result = await this.roleService.update(id, updateRoleDto);
    return new APIResponse<Role>(
      HttpStatus.OK,
      `Role ${result.name} update successfully`,
      result,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin can delete any Role by Id' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/roles')
  async deleteRole(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Role>> {
    const result = await this.roleService.remove(id);
    return new APIResponse<Role>(
      HttpStatus.OK,
      'Role deleted successfully!',
      result,
    );
  }
}
