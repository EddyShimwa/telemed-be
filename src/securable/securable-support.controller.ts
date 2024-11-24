import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SecurableService } from './securable.service';
import APIResponse from 'src/utils/response';
import { Securable } from './entities/securable.entity';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import { Authenticate } from 'src/common/decorators/auth.decorator';

@ApiTags('Securable Support')
@Controller('securable-support')
export class SecurableSupportController {
  constructor(private readonly securableService: SecurableService) {}

  @Get('all-deleted')
  @ApiOperation({ summary: 'Admin can view all recently deleted securables' })
  @ApiResponseDecorator()
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
  })
  @ApiQuery({ name: 'take', required: false, description: 'Optional take' })
  @ApiQuery({ name: 'search', required: false, description: 'Optional search' })
  @Authenticate('/dashboard/settings/recent-deleted/securables')
  async findAllDeleted(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    const result = await this.securableService.findAllDeleted(
      pageNumber,
      take,
      search,
    );
    return new APIResponse(
      HttpStatus.OK,
      'Deleted securables fetched successfully!',
      result,
    );
  }

  @Patch('/recover/:id')
  @ApiOperation({ summary: 'Admin can recover a recently deleted securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/recent-deleted/securables')
  async recoverSecurable(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.recoverSercurable(id);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      'Securable recovered successfully!',
      result,
    );
  }

  @Patch(':securableId/assign-role/:roleId')
  @ApiOperation({ summary: 'Admin can assign role to a securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/securables')
  async assignRole(
    @Param('roleId', ValidUUID) roleId: string,
    @Param('securableId', ValidUUID) securableId: string,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.assignRole(securableId, roleId);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      `Successfully assigned role to a securable!`,
      result,
    );
  }

  @Delete(':securableId/remove-role/:roleId')
  @ApiOperation({ summary: 'Admin can remove role from a securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/securables')
  async removeRole(
    @Param('roleId', ValidUUID) roleId: string,
    @Param('securableId', ValidUUID) securableId: string,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.removeRole(securableId, roleId);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      `Successfully removed role from a securable!`,
      result,
    );
  }
}
