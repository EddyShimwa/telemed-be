import { Module } from '@nestjs/common';
import { RoleModule } from 'src/role/role.module';
import { SecurableService } from './securable.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Securable } from './entities/securable.entity';
import { SecurableController } from './securable.controller';
import { SecurableSupportController } from './securable-support.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Securable]), RoleModule],
  controllers: [SecurableController, SecurableSupportController],
  providers: [SecurableService],
  exports: [SecurableService],
})
export class SecurableModule {}
