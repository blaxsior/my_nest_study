import { Test } from '@nestjs/testing';
import { CurrentUserInterceptor } from './current-user.interceptor';
import { UsersService } from '../users.service';
import type { User } from '../user.entity';
import { createMock } from '@golevelup/ts-jest';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
jest.mock('../users.service'); // 유저 mocking

// https://stackoverflow.com/questions/74069316/nestjs-test-on-response-from-interceptor
// https://stackoverflow.com/questions/69393098/how-to-test-nestjs-response-interceptor
// test: rxjs 공부 후에 다시 접근하자
describe('CurrentUserInterceptor', () => {
  let interceptor: CurrentUserInterceptor;
  let userService: UsersService;
  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [CurrentUserInterceptor, UsersService],
    }).compile();
    interceptor = testingModule.get(CurrentUserInterceptor);
    userService = testingModule.get(UsersService);
    jest.spyOn(userService, 'findOne').mockImplementation((id) =>
      Promise.resolve({
        id: id,
        email: 'test@test.com',
        password: 'password',
      } as User),
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
