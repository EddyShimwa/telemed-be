import { HttpStatus } from '@nestjs/common';

export default class APIResponse<T> {
  constructor(
    private readonly statusCode: HttpStatus,
    private readonly message: string,
    private readonly data?: T,
  ) {}
}
