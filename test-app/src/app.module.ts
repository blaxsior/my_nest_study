import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { MessageRepository } from './messages/message.repository';

@Module({
  controllers: [AppController, MessagesController],
  providers: [
    AppService,
    MessagesService,
    {
      provide: 'MSG_REPO',
      useClass: MessageRepository
    }
  ]
})
export class AppModule {
  constructor() {
    console.log("App Module Created");
  }
}
