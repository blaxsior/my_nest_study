import { Body, Controller, DefaultValuePipe, Get, Post, Param, ParseBoolPipe, ParseIntPipe, Query, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval, map, scan } from 'rxjs';
import { CreateMessageDTO } from './dtos/createMessage.dto';

@Controller()
export class AppController {
    constructor() {
        console.log("App Controller Created");
    }

    @Get('hello/:id')
    hello(
        @Param('id',
            ParseIntPipe,) id?: number,
        @Query('test',
            new DefaultValuePipe(false),
            ParseBoolPipe) test?: boolean
    ) {
        return `id is ${id}, type of ${typeof id}, ${test}`;
    }

    @Post('hello')
    postMessage(@Body() createMessageDTO: CreateMessageDTO) {
        return `${createMessageDTO.content}`;
    }

    @Sse('comments/:id')
    commentAlert(@Param('id', ParseIntPipe) id: number): Observable<MessageEvent> {
        // res.write('data: hello\n\n');
        return interval(1000)
            .pipe(
                scan((v) => v + 1, id), 
                map((v) => ({data: {count: v}}))
            );
    }
}