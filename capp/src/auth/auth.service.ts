import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { checkPassword, generatePassword } from './util/password';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 유저 존재 확인
    const isUserExist = await this.usersService.isUserExist(email);
    if (isUserExist) {
      throw new BadRequestException('email in use');
    }
    // 비밀번호 해싱
    const stored_password = await generatePassword(password);

    // 유저를 생성 및 저장
    const user = await this.usersService.create(email, stored_password);
    // 유저 반환

    return user;
  }

  async signIn(email: string, password: string) {
    const errorMessage = 'something wrong with email or password';
    const user = await this.usersService.find(email);
    if (!user) {
      // 해당되는 유저가 없음
      throw new BadRequestException(errorMessage);
    }
    const userExist = await checkPassword(password, user.password);
    if (!userExist) {
      throw new BadRequestException(errorMessage);
    }
    return user;
  }
}
