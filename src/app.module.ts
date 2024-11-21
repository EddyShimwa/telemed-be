import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import DatabaseService from './database/database.service';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    UserModule,
    RoleModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, CloudinaryService],
})
export class AppModule {}
