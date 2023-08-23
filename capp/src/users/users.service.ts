import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });
    const result = await validate(user);
    if (result.length === 0) {
      await this.userRepo.save(user);
    }
  }

  async findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async find(email: string) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: number, attrs: Partial<Omit<User, 'id'>>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }
  // 유저 없을 때 에러를 던져야 하나?
  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepo.remove(user);
  }

  async isUserExist(email: string) {
    return this.userRepo.exist({
      where: {
        email,
      },
    });
  }
}
