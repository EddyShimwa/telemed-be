import { Request } from 'express';

export default interface ExtendedRequest extends Request {
  token?: string;
}
