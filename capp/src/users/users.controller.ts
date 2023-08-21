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
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeDTO1 } from 'src/interceptors/serialize1.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@SerializeDTO1(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.usersService.create(body.email, body.password);
    return body;
  }

  // @SerializeDTO(UserDto)
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
  // @UseInterceptors(SerializeInterceptor1)
  // @UseDto(UserDto)
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
