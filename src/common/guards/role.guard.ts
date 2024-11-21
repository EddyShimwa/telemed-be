import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(private readonly refrector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.refrector.get<string[]>('roles', context.getHandler());

    const req = context.switchToHttp().getRequest() as Request;
    const { role } = req.user as User;

    if (!roles.includes(role.name)) {
      throw new ForbiddenException('You are not allowed to access this route');
    }

    return true;
  }
}
