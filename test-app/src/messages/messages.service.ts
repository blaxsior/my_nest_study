import { Injectable, Inject } from '@nestjs/common';

interface Repository {
    findOne(id:string): Promise<any>;
    findAll(): Promise<any>;
    create(content:string): Promise<void>;
}

@Injectable()
export class MessagesService {
    constructor(@Inject('MSG_REPO') private messageRepo: Repository) {
        console.log("Message Service Created")
    }

    async findOne(id: string) {
        return await this.messageRepo.findOne(id);
    }

    async findAll() {
        return await this.messageRepo.findAll();
    }

    async create(content: string) {
        await this.messageRepo.create(content);
    }
}
