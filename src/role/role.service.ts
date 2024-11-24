import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/createRoleDto.dto';
import Role from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/updateRoleDto.dto';
import PaginatorHelper from 'src/utils/paginator-helper';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const roleExist = await this.findOneBy('name', createRoleDto.name);

    if (roleExist) {
      if (roleExist.isDeleted) {
        throw new ConflictException(
          `Role with name: ${createRoleDto.name} was recently deleted, Better undergo process to recover it!`,
        );
      } else {
        throw new ConflictException(
          `Role with name: ${createRoleDto.name} already exist in our system!`,
        );
      }
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findOne(id: string): Promise<Role> {
    const role = this.roleRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!role) throw new NotFoundException('Role not found!');
    return role;
  }

  async findOneBy(field: keyof Role, fieldValue: string): Promise<Role> {
    const role = this.roleRepository.findOne({
      where: { [field]: fieldValue },
    });
    return role;
  }

  async findAll(pageNumber: number, take?: number, search?: string) {
    let where: FindOptionsWhere<Role> | FindOptionsWhere<Role>[] = [
      { isDeleted: false },
    ];

    if (search && search.length > 0) {
      where = [
        ...where,
        { name: ILike(`%${search}%`), isDeleted: false },
        { description: ILike(`%${search}%`), isDeleted: false },
      ];
    }

    return PaginatorHelper.paginate<Role>(
      this.roleRepository,
      'roles',
      pageNumber,
      take,
      [
        'id',
        'name',
        'description',
        'isDeleted',
        'securables',
        'users',
        'createdAt',
      ],
      ['securables', 'users'],
      where,
    );
  }

  async findAllDeleted(pageNumber: number, take?: number, search?: string) {
    let where: FindOptionsWhere<Role> | FindOptionsWhere<Role>[] = [
      { isDeleted: true },
    ];

    if (search && search.length > 0) {
      where = [
        ...where,
        { name: ILike(`%${search}%`), isDeleted: true },
        { description: ILike(`%${search}%`), isDeleted: true },
      ];
    }

    return PaginatorHelper.paginate<Role>(
      this.roleRepository,
      'roles',
      pageNumber,
      take,
      [
        'id',
        'name',
        'description',
        'isDeleted',
        'securables',
        'users',
        'createdAt',
      ],
      ['securables', 'users'],
      where,
    );
  }

  async recoverRole(id: string): Promise<Role> {
    const role = await this.findOneBy('id', id);
    role.isDeleted = false;
    return this.roleRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<Role> {
    const role = await this.findOne(id);
    role.isDeleted = true;
    return this.roleRepository.save(role);
  }
}
