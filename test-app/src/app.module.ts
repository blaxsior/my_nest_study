import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { MessageRepository } from './messages/message.repository';


//
const mockupMessagesService = {
  findOne: async (id: string) => `id = ${id}`,
  findAll: async () => ['1','2','3'],
  create: async () => {console.log("create")}
};
@Module({
  controllers: [AppController, MessagesController],
  providers: [
    AppService,
    {
      provide: MessagesService,
      useValue: mockupMessagesService
    },
    // MessagesService,
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
