import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as pwModule from './util/password';
import { User } from 'src/users/user.entity';
import { BadRequestException } from '@nestjs/common';

jest.mock('../users/users.service');
// 여기서 mocking하면 객체 단위로 교체해서 @Injectable 잃음 -> DI 동작 X
jest.mock<Partial<typeof pwModule>>('./util/password', () => ({
  generatePassword: jest.fn((pass) => Promise.resolve(pass)),
  checkPassword: jest.fn((user_pass, stored_pass) =>
    Promise.resolve(user_pass === stored_pass),
  ),
}));

describe('class AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  // 필요한 메서드만 mocking하자.

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // 모든 mock 함수에 대한 호출 기록을 지움
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signup()', () => {
    it('should return user if email not in use', async () => {
      //Arrange
      const email = 'test';
      const password = 'test';
      const expected = { email, password, id: 1 } as User;

      jest
        .spyOn(userService, 'isUserExist')
        .mockReturnValueOnce(Promise.resolve(false));
      jest
        .spyOn(userService, 'create')
        .mockImplementationOnce((email, password) =>
          Promise.resolve({ email, password, id: 1 } as User),
        );
      // Act
      const result = await authService.signup(email, password);

      // Assert
      expect(result).toEqual(expected);
      expect(userService.isUserExist).toBeCalled();
      expect(pwModule.generatePassword).toBeCalled();
      expect(userService.create).toBeCalled();
    });
    it('should throw error if email in use', async () => {
      const email = 'test';
      const password = 'test';
      jest
        .spyOn(userService, 'isUserExist')
        .mockReturnValueOnce(Promise.resolve(true));
      //Act
      const promise = authService.signup(email, password);
      //Assert
      await expect(promise).rejects.toThrow(BadRequestException);
      expect(userService.isUserExist).toBeCalled();
      expect(pwModule.generatePassword).not.toBeCalled();
      expect(userService.create).not.toBeCalled();
    });
  });

  describe('signin()', () => {
    it('should throw error if there is no user matching email', async () => {
      const email = 'test';
      const password = 'test';
      //Act
      const promise = authService.signin(email, password);

      await expect(promise).rejects.toThrow(BadRequestException);
      expect(pwModule.checkPassword).not.toBeCalled();
    });

    it('should throw error if user exist but not match password', async () => {
      const email = 'test';
      const input_password = 'invalid';
      const real_password = 'password';
      jest
        .spyOn(userService, 'find')
        .mockImplementationOnce((email) =>
          Promise.resolve({ id: 1, email, password: real_password } as User),
        );
      // Act
      const promise = authService.signin(email, input_password);
      // Assert
      await expect(promise).rejects.toThrow(BadRequestException);
      expect(userService.find).toBeCalled();
      expect(pwModule.checkPassword).toBeCalled();
    });

    it('should return user if correct password passed', async () => {
      const email = 'test';
      const input_password = 'password';
      const real_password = 'password';
      const expected = { id: 1, email, password: real_password } as User;
      jest
        .spyOn(userService, 'find')
        .mockImplementationOnce((email) =>
          Promise.resolve({ id: 1, email, password: real_password } as User),
        );
      // Act
      const result = await authService.signin(email, input_password);
      // Assert
      await expect(result).toEqual(expected);
      // expect(userService.find).toBeCalled();
      // expect(pwModule.checkPassword).toBeCalled();
    });
  });
});
