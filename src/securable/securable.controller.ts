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
import { SecurableService } from './securable.service';
import { CreateSecurableDto } from './dto/create-securable.dto';
import APIResponse from 'src/utils/response';
import { Securable } from './entities/securable.entity';
import { UpdateSecurableDto } from './dto/update-securable.dto';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import { Authenticate } from 'src/common/decorators/auth.decorator';

@ApiTags('Securable')
@Controller('securables')
export class SecurableController {
  constructor(private readonly securableService: SecurableService) {}

  @Post()
  @ApiOperation({ summary: 'Developer can add new securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async create(
    @Body() createSecurableDto: CreateSecurableDto,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.create(createSecurableDto);
    return new APIResponse<Securable>(
      HttpStatus.CREATED,
      'Securable created successfully!',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Admin can view all securables' })
  @ApiResponseDecorator()
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
  })
  @ApiQuery({ name: 'take', required: false, description: 'Optional take' })
  @ApiQuery({ name: 'search', required: false, description: 'Optional search' })
  @Authenticate('/dashboard/settings/securables')
  async findAll(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    const result = await this.securableService.findAll(
      pageNumber,
      take,
      search,
    );
    return new APIResponse(
      HttpStatus.OK,
      'Securables fetched successfully!',
      result,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin can view a securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/securables')
  async findOne(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.findOne(id);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      'Securable fetched successfully!',
      result,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin can update a securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/securables')
  async update(
    @Param('id', ValidUUID) id: string,
    @Body() updateSecurableDto: UpdateSecurableDto,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.update(id, updateSecurableDto);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      'Securable updated successfully!',
      result,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin can deleted a securable' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/settings/securables')
  async remove(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<Securable>> {
    const result = await this.securableService.remove(id);
    return new APIResponse<Securable>(
      HttpStatus.OK,
      'Securable deleted successfully!',
      result,
    );
  }
}
