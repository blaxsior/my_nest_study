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
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeDTO1 } from '../interceptors/serialize1.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from '../auth/auth.service';
import { SignInUserDto } from './dtos/signin-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@SerializeDTO1(UserDto)
export class UsersController {
  accessor hello: string;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signin')
  async signInUser(
    @Body() body: SignInUserDto,
    @Session() session: any,
    //nestjs에게 맡기기
  ) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Get('/signout')
  async signOutUser(@Session() session: any) {
    session.userId = null;
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    console.log(color);
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    console.log('get');
    console.log(session.color);
    return session.color;
  }

  @Get('/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  /**
   * @param {string?} email
   * @returns {User} User
   */
  @Get()
  async findUserByEmail(@Query('email') email?: string) {
    if (!email) return null; // email 정보 없으면 반환 안하게
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
