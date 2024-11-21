import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailService } from './email.service';
import SendEmailCommandHandler from './commands/handler/send-email-command.handler';
import SendEmailEventHandler from './events/handler/send-email-event.handler';

@Module({
  imports: [CqrsModule],
  providers: [EmailService, SendEmailCommandHandler, SendEmailEventHandler],
})
export class EmailModule {}
