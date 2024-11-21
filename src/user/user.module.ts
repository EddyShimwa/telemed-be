import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import RoleGuard from 'src/common/guards/role.guard';
import Role from 'src/role/entities/role.entity';
import PaginatorHelper from 'src/utils/paginator-helper';
import Logout from './entities/logout.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Logout]),
    CqrsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, RoleGuard, PaginatorHelper],
  exports: [UserService],
})
export class UserModule {}
