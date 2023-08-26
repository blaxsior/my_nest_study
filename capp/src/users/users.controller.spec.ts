import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from '@nestjs/common';

import type { User } from './user.entity';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { SignInUserDto } from './dtos/signin-user.dto';
import type { UpdateUserDto } from './dtos/update-user.dto';

jest.mock('./users.service'); // user service mocking
// findOne, find, update, remove
jest.mock('../auth/auth.service'); // auth service mocking
// signup, signin
// 아래에서 spyOn 함수로 오버라이딩. mock에서 하면 @Injectable 잃음.

// whoAmI는 매우 단순하므로 테스트 안함.
describe('class UsersController', () => {
  const baseUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hello',
  } as User;
  const userService: jest.Mocked<Partial<UsersService>> = {
    findOne: jest.fn((id: number) =>
      Promise.resolve(id === 1 ? baseUser : null),
    ),
    find: jest.fn((email: string) =>
      Promise.resolve(email === 'test@test.com' ? baseUser : null),
    ),
    update: jest.fn((id: number, attrs: Partial<Omit<User, 'id'>>) =>
      Promise.resolve({ ...baseUser, ...attrs, id } as User),
    ),
    remove: jest.fn((id: number) =>
      Promise.resolve({ ...baseUser, id } as User),
    ),
  };
  const authService: jest.Mocked<Partial<AuthService>> = {
    signin: jest.fn((email: string, password: string) =>
      Promise.resolve({ ...baseUser, email, password } as User),
    ),
    signup: jest.fn((email: string, password: string) =>
      Promise.resolve({ ...baseUser, email, password } as User),
    ),
  };
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: userService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
      controllers: [UsersController],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser()', () => {
    it('should return user and set session userId', async () => {
      const email = 'test';
      const password = 'test';
      const input = { email, password } satisfies CreateUserDto;
      const mockSession: { userId?: number } = {};
      const expected = { id: 1, email, password } as User;

      const promise = controller.createUser(input, mockSession);

      await expect(promise).resolves.toEqual(expected);
      expect(mockSession.userId).toBe(expected.id);
    });
  });

  describe('signInUser()', () => {
    it('should return user and set session userId', async () => {
      const email = 'test';
      const password = 'test';
      const input = { email, password } satisfies SignInUserDto;
      const mockSession: { userId?: number } = {};
      const expected = { id: 1, email, password } as User;

      const promise = controller.signInUser(input, mockSession);

      await expect(promise).resolves.toEqual(expected);
      expect(mockSession.userId).toBe(expected.id);
    });
  });

  describe('findUserById()', () => {
    it('should return user if id match', async () => {
      // mockup에 id === 1이면 객체를 반환하도록 정의되어 있음.
      const id = 1;
      const expectedUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hello',
      };

      const promise = controller.findUserById(id);

      await expect(promise).resolves.toEqual(expectedUser);
    });

    it('should throw NotFoundException if user(id) not exist', async () => {
      // mockup에 id === 1이면 객체를 반환하도록 정의되어 있음.
      const id = 2;
      const promise = controller.findUserById(id);
      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserByEmail()', () => {
    it('should return user matching the email if that user exists', async () => {
      // baseUser 참고
      const email = 'test@test.com';
      const expectedUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hello',
      };
      const promise = controller.findUserByEmail(email);
      await expect(promise).resolves.toEqual(expectedUser);
    });

    it('should return null if there is no user matching email', async () => {
      // baseUser 참고
      const email = 'invalid@test.com';

      const promise = controller.findUserByEmail(email);
      await expect(promise).resolves.toBeNull();
    });

    it('should return null if email is not provided', async () => {
      // baseUser 참고
      const promise = controller.findUserByEmail();

      await expect(promise).resolves.toBeNull();
    });
  });

  describe('updateUser()', () => {
    it('should call userService.update()', async () => {
      const id = 1;
      const updateData: UpdateUserDto = { email: 'test', password: 'test' };
      const updateSpy = jest.spyOn(userService, 'update');

      await controller.updateUser(id, updateData);

      expect(updateSpy).toBeCalled();
    });
  });

  describe('removeUser()', () => {
    it('should call userService.remove()', async () => {
      const id = 1;
      const removeSpy = jest.spyOn(userService, 'remove');
      await controller.removeUser(id);

      expect(removeSpy).toBeCalled();
    });
  });
});
