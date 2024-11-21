import { Injectable } from '@nestjs/common';

@Injectable()
export default class SendEmailEvent {
  constructor(
    readonly to: string,
    readonly subject: string,
    readonly name: string,
    readonly text: string,
    readonly buttonText: string,
    readonly buttonLink: string,
  ) {}
}
