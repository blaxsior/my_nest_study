import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessageRepository {
    private async fetchData() {
        const contents = await readFile('messages.json', 'utf-8');
        const messages = JSON.parse(contents);
        return messages;
    }
    async findOne(id: string) {
        const messages = await this.fetchData();
        return messages[id];
    }

    async findAll() {
        const messages = await this.fetchData();
        return messages;
    }

    async create(content: string) {
        const messages = await this.fetchData();
        const id = Math.floor(Math.random() * 1000);
        messages[`${id}`] = { id, content };
        await writeFile('messages.json', JSON.stringify(messages));
    }
}
