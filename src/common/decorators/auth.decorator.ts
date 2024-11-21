import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import RoleGuard from '../guards/role.guard';
import { Roles } from './role.decorator';

export const Auth = (...roles: Array<string>) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Roles(...roles),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
