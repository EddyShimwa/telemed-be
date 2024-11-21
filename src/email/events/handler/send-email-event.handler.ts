import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import SendEmailEvent from '../implementation/send-email.event';
import { EmailService } from 'src/email/email.service';

@EventsHandler(SendEmailEvent)
export default class SendEmailEventHandler
  implements IEventHandler<SendEmailEvent>
{
  constructor(private readonly emailService: EmailService) {}
  async handle({
    to,
    subject,
    name,
    text,
    buttonText,
    buttonLink,
  }: SendEmailEvent) {
    console.log(
      `Sending email to ${to} with subject ${subject} and text ${text}`,
    );
    await this.emailService.sendEmail(
      to,
      subject,
      name,
      text,
      buttonText,
      buttonLink,
    );
  }
}
