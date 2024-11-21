import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import SendEmailCommand from '../implementation/send-email.command';
import SendEmailEvent from 'src/email/events/implementation/send-email.event';

@CommandHandler(SendEmailCommand)
export default class SendEmailCommandHandler
  implements ICommandHandler<SendEmailCommand>
{
  constructor(private readonly eventBus: EventBus) {}
  async execute({
    to,
    subject,
    name,
    text,
    buttonLink,
    buttonText,
  }: SendEmailCommand): Promise<any> {
    await this.eventBus.publish(
      new SendEmailEvent(to, subject, name, text, buttonText, buttonLink),
    );
  }
}
