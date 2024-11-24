import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import Role from 'src/role/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { Permission } from 'src/role/entities/permission.entity';
import PaginatorHelper from 'src/utils/paginator-helper';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    CqrsModule,
    forwardRef(() => AuthModule),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, PaginatorHelper],
  exports: [UserService],
})
export class UserModule {}
