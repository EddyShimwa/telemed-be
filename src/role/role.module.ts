import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from './entities/role.entity';
import { RolesController } from './role.controller';
import { RoleSupportController } from './role-support.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController, RoleSupportController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
