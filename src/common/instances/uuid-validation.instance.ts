import { ParseUUIDPipe, BadRequestException } from '@nestjs/common';

export const ValidUUID = new ParseUUIDPipe({
  exceptionFactory: () => new BadRequestException('Invalid identification.'),
});
