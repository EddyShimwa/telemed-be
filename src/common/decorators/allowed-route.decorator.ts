import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const AllowedRoute = (route: string): CustomDecorator<string> =>
  SetMetadata('allowedRoute', route);
