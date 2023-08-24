import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request } from 'express';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {} // DI 가능!
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.session?.userId;
    if (userId != null) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }
    return next.handle();
  }
}
