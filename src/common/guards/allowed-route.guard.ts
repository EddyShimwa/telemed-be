import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Securable } from 'src/securable/entities/securable.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AllowedRouteGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const route = this.reflector.get<string>(
      'allowedRoute',
      context.getHandler(),
    );

    if (!route) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const isAllowed = await this.userAllowed(user, route);
    if (!isAllowed) {
      throw new ForbiddenException('You are not allowed to access this route');
    }
    return isAllowed;
  }
  private async userAllowed(user: User, route: string) {
    const activity = await Securable.findOne({
      where: { route },
      relations: ['roles'],
    });
    if (!activity) {
      return true;
    }
    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    return activity.roles.some((role) =>
      user.roles.some((userRole) => userRole.id === role.id),
    );
  }
}
