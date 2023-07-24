import { Test, TestingModule } from '@nestjs/testing';
import { MessageRepository } from './message.repository.js';

describe('MessageRepositoryTs', () => {
  let provider: MessageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRepository],
    }).compile();

    provider = module.get<MessageRepository>(MessageRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
