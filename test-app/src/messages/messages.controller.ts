import { Body, Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from 'src/dtos/createMessage.dto';

@Controller('messages')
export class MessagesController {
    constructor(
        private mss: MessagesService
        ) {
        console.log("Message Controller Created")
    }

    @Get('/all')
    async getAllMessages() { // 위에 있으면 먼저 캡쳐됨
        return await this.mss.findAll();
    } 

    @Get(':id') // exception filter 사용
    async getSpecificMessage(@Param('id') id: string) {
        const target =  await this.mss.findOne(id);
        if(target) return target;
        else throw new NotFoundException(`no message [id: ${id}]`);
    }

    @Post('/create')
    async postCreateMessage(@Body() dto: CreateMessageDTO) {
        // 사용자 측에서 Content-type: application/json 헤더 지정해야 함
        await this.mss.create(dto.content);
    }
}
