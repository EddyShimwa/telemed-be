import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const ApiResponseDecorator = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Successfully created a new resource.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Task is successfully.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request. Validation errors or incorrect input.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Unauthorized. Authentication credentials are missing or invalid.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Forbidden. The user does not have the necessary permissions.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not found. The requested resource was not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description:
        'Conflict. The request could not be completed due to a conflict with the current state of the resource.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Internal server error. An unexpected error occurred on the server.',
    }),
    ApiResponse({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description:
        'Service unavailable. The server is currently unable to handle the request.',
    }),
  );
