import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { UserModule } from 'src/user/user.module';
import { RoleSecurables } from 'src/securable/entities/role_securable.entity';
import { SecurableModule } from 'src/securable/securable.module';
import { MenuSupportController } from './menu-support.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity, RoleSecurables]),
    UserModule,
    SecurableModule,
  ],
  controllers: [MenusController, MenuSupportController],
  providers: [MenusService],
})
export class MenusModule {}
