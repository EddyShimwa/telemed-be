import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { AllowedRouteGuard } from '../guards/allowed-route.guard';
import { AllowedRoute } from './allowed-route.decorator';

export const Authenticate = (route?: string) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(JwtAuthGuard, AllowedRouteGuard),
    ...(route ? [AllowedRoute(route)] : []),
  );
