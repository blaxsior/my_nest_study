import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeDTO1 } from 'src/interceptors/serialize1.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { Response } from 'express';

@Controller('auth')
@SerializeDTO1(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  async signInUser(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
    //nestjs에게 맡기기
  ) {
    const user = await this.authService.signIn(body.email, body.password);
    res.cookie('userid', user.id);
    return user;
  }

  @Get('/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    console.log(user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  /**
   * @param email {string}
   * @returns User {id, email}[]
   */
  @Get()
  async findAllUsersByEmail(@Query('email') email: string) {
    if (!email) return []; // email 정보 없으면 반환 안하게
    return this.usersService.find(email);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number, // 실제로는 파싱 필요 X
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
