import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Securable } from './entities/securable.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateSecurableDto } from './dto/create-securable.dto';
import PaginatorHelper from 'src/utils/paginator-helper';
import { UpdateSecurableDto } from './dto/update-securable.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class SecurableService {
  constructor(
    @InjectRepository(Securable)
    private readonly securableRepository: Repository<Securable>,
    private readonly roleService: RoleService,
  ) {}

  async create(createSecurableDto: CreateSecurableDto): Promise<Securable> {
    const securableExist = await this.findOneBy(
      'route',
      createSecurableDto.route,
    );

    if (securableExist) {
      if (securableExist.isDeleted) {
        throw new ConflictException(
          `Sorry, Securable on route (${createSecurableDto.route}) was recently deleted, Better undergo process to recover it and edit it if you want!`,
        );
      } else {
        throw new ConflictException(
          `Securable on route (${createSecurableDto.route}) already exist in our system!`,
        );
      }
    }

    const securable = this.securableRepository.create(createSecurableDto);
    return this.securableRepository.save(securable);
  }

  async findOne(id: string): Promise<Securable> {
    const securable = await this.securableRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['roles'],
    });
    if (!securable) throw new NotFoundException('Securable not found!');
    return securable;
  }

  async findOneBy(
    field: keyof Securable,
    fieldValue: string,
  ): Promise<Securable> {
    return this.securableRepository.findOne({
      where: { [field]: fieldValue },
    });
  }

  async findAll(pageNumber: number, take?: number, search?: string) {
    let where: FindOptionsWhere<Securable> | FindOptionsWhere<Securable>[] = [
      { isDeleted: false },
    ];

    if (search && search.length > 0) {
      where = [
        ...where,
        { name: ILike(`%${search}%`), isDeleted: false },
        { route: ILike(`%${search}%`), isDeleted: false },
        { description: ILike(`%${search}%`), isDeleted: false },
      ];
    }

    return PaginatorHelper.paginate<Securable>(
      this.securableRepository,
      'securables',
      pageNumber,
      take,
      ['id', 'name', 'route', 'description', 'isDeleted', 'createdAt', 'roles'],
      ['roles'],
      where,
    );
  }

  async findAllDeleted(pageNumber: number, take?: number, search?: string) {
    let where: FindOptionsWhere<Securable> | FindOptionsWhere<Securable>[] = [
      { isDeleted: true },
    ];

    if (search && search.length > 0) {
      where = [
        ...where,
        { name: ILike(`%${search}%`), isDeleted: true },
        { route: ILike(`%${search}%`), isDeleted: true },
        { description: ILike(`%${search}%`), isDeleted: true },
      ];
    }

    return PaginatorHelper.paginate<Securable>(
      this.securableRepository,
      'securables',
      pageNumber,
      take,
      ['id', 'name', 'route', 'description', 'isDeleted', 'createdAt', 'roles'],
      ['roles'],
      where,
    );
  }

  async update(
    id: string,
    updateSecurableDto: UpdateSecurableDto,
  ): Promise<Securable> {
    const securable = await this.findOne(id);
    Object.assign(securable, updateSecurableDto);
    return this.securableRepository.save(securable);
  }

  async recoverSercurable(id: string): Promise<Securable> {
    const securable = await this.findOneBy('id', id);
    securable.isDeleted = false;
    return this.securableRepository.save(securable);
  }

  async remove(id: string): Promise<Securable> {
    const securable = await this.findOne(id);
    securable.isDeleted = true;
    return this.securableRepository.save(securable);
  }

  async assignRole(id: string, roleId: string): Promise<Securable> {
    const securable = await this.findOne(id);
    console.log(securable);
    const role = await this.roleService.findOne(roleId);
    console.log(securable, role);
    securable.roles = [...securable.roles, role];
    return this.securableRepository.save(securable);
  }

  async removeRole(id: string, roleId: string): Promise<Securable> {
    const securable = await this.findOne(id);
    const role = await this.roleService.findOne(roleId);
    securable.roles = securable.roles.filter((r) => r.id !== role.id);
    return this.securableRepository.save(securable);
  }
}
