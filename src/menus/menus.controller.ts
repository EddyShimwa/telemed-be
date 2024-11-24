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
  Req,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import APIResponse from 'src/utils/response';
import { MenuEntity } from './entities/menu.entity';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import { Authenticate } from 'src/common/decorators/auth.decorator';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';

@ApiTags('Menu')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: 'Developer can add new menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async create(
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menusService.create(createMenuDto);
    return new APIResponse<MenuEntity>(
      HttpStatus.CREATED,
      'Menu added successfully!',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Anyone can view menus based on his/her role' })
  @ApiResponseDecorator()
  @Authenticate()
  async findAll(
    @Req() request: Request,
  ): Promise<APIResponse<Array<MenuEntity>>> {
    const user = request['user'] as User;
    const result = await this.menusService.findAll(user);
    return new APIResponse<Array<MenuEntity>>(
      HttpStatus.OK,
      'Menus fetched successfully!',
      result,
    );
  }

  @Get('all-menus')
  @ApiOperation({ summary: 'Developer can view all menus' })
  @ApiResponseDecorator()
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
  })
  @ApiQuery({ name: 'take', required: false, description: 'Optional take' })
  @ApiQuery({ name: 'search', required: false, description: 'Optional search' })
  @Authenticate('/dashboard/menus')
  async findAllMenus(
    @Query('pageNumber') pageNumber: number,
    @Query('take') take?: number,
    @Query('search') search?: string,
  ) {
    const result = await this.menusService.findAllMenus(
      pageNumber,
      take,
      search,
    );
    return new APIResponse(
      HttpStatus.OK,
      'All Menus fetched successfully!',
      result,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Developer can view a single menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async findOne(
    @Param(':id', ValidUUID) id: string,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menusService.findOne(id);
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'Menu fetched successfully!',
      result,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Developer can update any menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async update(
    @Param('id', ValidUUID) id: string,
    updateMenuDto: UpdateMenuDto,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menusService.update(id, updateMenuDto);
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'Menu updated successfully',
      result,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Developer can delete any menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async remove(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menusService.remove(id);
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'Menu deleted successfully!',
      result,
    );
  }
}
