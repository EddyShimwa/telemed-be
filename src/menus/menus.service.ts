import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { FindOptionsWhere, ILike, In, IsNull, Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RoleSecurables } from 'src/securable/entities/role_securable.entity';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { SecurableService } from 'src/securable/securable.service';
import PaginatorHelper from 'src/utils/paginator-helper';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(RoleSecurables)
    private readonly roleSecurableRepository: Repository<RoleSecurables>,
    private readonly userService: UserService,
    private readonly securableService: SecurableService,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<MenuEntity> {
    const menuExist = await this.findOneBy('name', createMenuDto.name);

    if (menuExist) {
      if (menuExist.isDeleted) {
        throw new ConflictException(
          `Sorry, This menu ${createMenuDto.name} was recently deleted, Better undergo process to recover it!`,
        );
      } else {
        throw new ConflictException(
          `This menu ${createMenuDto.name} already exist in our system!`,
        );
      }
    }
    const securable = await this.securableService.findOne(
      createMenuDto.securable_id,
    );
    const menu = this.menuRepository.create(createMenuDto);
    menu.securable = securable;
    return this.menuRepository.save(menu);
  }

  async findOne(id: string): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['securable', 'childMenus', 'childMenus.securable'],
    });
    if (!menu) throw new NotFoundException('Menu not found!');
    return menu;
  }

  async findOneBy(
    field: keyof MenuEntity,
    fieldValue: string,
  ): Promise<MenuEntity> {
    return this.menuRepository.findOne({ where: { [field]: fieldValue } });
  }

  async findAll(user: User): Promise<Array<MenuEntity>> {
    const user_data = await this.userService.findOne(user?.id);
    const roleIds = user_data.roles?.map((role) => role?.id);

    const role_securables = await this.roleSecurableRepository.find({
      where: { role_id: In(roleIds) },
      relations: ['securable'],
    });
    const securableIds = role_securables?.map(
      (role_securable) => role_securable?.securable?.id,
    );
    const menus = await this.menuRepository.find({
      relations: ['securable', 'childMenus', 'childMenus.securable'],
      where: {
        securable_id: In(securableIds),
        isDeleted: false,
        parentMenu: IsNull(),
      },
      order: { ordering: 'ASC' },
    });

    for (const menu of menus) {
      menu.childMenus = menu.childMenus.filter(
        (childMenu) => !childMenu?.isDeleted,
      );
      menu.childMenus.sort((a, b) => a.ordering - b.ordering);
    }

    return menus;
  }

  async findAllMenus(pageNumber: number, take?: number, search?: string) {
    let where: FindOptionsWhere<MenuEntity> | FindOptionsWhere<MenuEntity>[] =
      [];

    if (search && search.length > 0) {
      where = [
        ...where,
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    }

    return PaginatorHelper.paginate<MenuEntity>(
      this.menuRepository,
      'menus',
      pageNumber,
      take,
      [
        'id',
        'name',
        'description',
        'icon',
        'ordering',
        'parentMenu',
        'childMenus',
        'isDeleted',
        'createdAt',
        'securable',
      ],
      ['parentMenu', 'securable', 'childMenus', 'childMenus.securable'],
      where,
    );
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<MenuEntity> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(menu);
  }

  async remove(id: string): Promise<MenuEntity> {
    const menu = await this.findOne(id);
    menu.isDeleted = true;
    return this.menuRepository.save(menu);
  }

  async recoverMenu(id: string): Promise<MenuEntity> {
    const menu = await this.findOneBy('id', id);
    menu.isDeleted = false;
    return this.menuRepository.save(menu);
  }

  async addSubMenu(
    parentId: string,
    menuDto: CreateMenuDto,
  ): Promise<MenuEntity> {
    const parentMenu = await this.findOne(parentId);
    const submenu = this.menuRepository.create(menuDto);
    submenu.parentMenu = parentMenu;
    await this.menuRepository.save(submenu);
    return this.findOne(parentId);
  }

  async findSubMenus(parentId: string): Promise<Array<MenuEntity>> {
    await this.findOne(parentId);
    return this.menuRepository.find({
      where: { parent_id: parentId },
      relations: ['parentMenu', 'securable'],
    });
  }

  async deleteSubMenu(id: string): Promise<MenuEntity> {
    const menu = await this.findOne(id);
    if (!menu.parentMenu)
      throw new BadRequestException(`Menu (${menu.name}) is not a submenu!`);

    menu.isDeleted = true;
    return this.menuRepository.save(menu);
  }
}
