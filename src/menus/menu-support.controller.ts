import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto } from './dto/create-menu.dto';
import APIResponse from 'src/utils/response';
import { MenuEntity } from './entities/menu.entity';
import { ApiResponseDecorator } from 'src/common/decorators/apiResponse.decorator';
import { ValidUUID } from 'src/common/instances/uuid-validation.instance';
import { Authenticate } from 'src/common/decorators/auth.decorator';

@ApiTags('Menu Support')
@Controller('menu-support')
export class MenuSupportController {
  constructor(private readonly menuService: MenusService) {}

  @Patch('recover-deleted/:id')
  @ApiOperation({ summary: 'Developer can recover deleted menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async recoverMenus(
    @Param(':id') id: string,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menuService.recoverMenu(id);
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'Menu recovered successfully',
      result,
    );
  }

  @Post('add-submenu/:parentMenuId')
  @ApiOperation({ summary: 'Developer can add submenu to a parent menu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async addSubMenu(
    @Param('parentMenuId', ValidUUID) parentMenuId: string,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menuService.addSubMenu(
      parentMenuId,
      createMenuDto,
    );
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'SubMenu added successfully!',
      result,
    );
  }

  @Get('all-submenus/:parentMenuId')
  @ApiOperation({
    summary: 'Developer can view all submenus of certain parent menu',
  })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async findAllSubMenus(
    @Param('parentMenuId', ValidUUID) parentMenuId: string,
  ): Promise<APIResponse<Array<MenuEntity>>> {
    const result = await this.menuService.findSubMenus(parentMenuId);
    return new APIResponse<Array<MenuEntity>>(
      HttpStatus.OK,
      'Submenus fetched successfully!',
      result,
    );
  }

  @Delete('delete-submenu/:id')
  @ApiOperation({ summary: 'Developer can delete a submenu' })
  @ApiResponseDecorator()
  @Authenticate('/dashboard/menus')
  async deleteSubmenu(
    @Param('id', ValidUUID) id: string,
  ): Promise<APIResponse<MenuEntity>> {
    const result = await this.menuService.deleteSubMenu(id);
    return new APIResponse<MenuEntity>(
      HttpStatus.OK,
      'SubMenu deleted successfully!',
      result,
    );
  }
}
